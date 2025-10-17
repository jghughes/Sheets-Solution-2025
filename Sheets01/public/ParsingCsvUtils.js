// Lightweight parsing utilities for a spreadsheet-like application.
// Designed for browser usage (placed in public/) and also exported as an ES module.

/**
 * Parse CSV text into an array of rows (each row is an array of cells).
 * Supports quoted fields, escaped quotes (""), CRLF/LF line endings.
 *
 * @param {string} text
 * @param {object} [options]
 * @param {string} [options.delimiter=',']
 * @returns {string[][]}
 */
export function parseCSV(text, options = {}) {
  const delimiter = options.delimiter || ",";
  const rows = [];
  let cur = "";
  let row = [];
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        // look ahead for escaped quote
        if (i + 1 < text.length && text[i + 1] === '"') {
          cur += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        cur += ch;
        i++;
        continue;
      }
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === delimiter) {
      row.push(cur);
      cur = "";
      i++;
      continue;
    }

    if (ch === "\r") {
      // handle CRLF or CR
      if (i + 1 < text.length && text[i + 1] === "\n") i++;
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      i++;
      continue;
    }

    if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
      i++;
      continue;
    }

    cur += ch;
    i++;
  }

  // push last
  row.push(cur);
  rows.push(row);
  return rows;
}

/**
 * Serialize rows (array of arrays) into CSV text.
 *
 * @param {string[][]} rows
 * @param {object} [options]
 * @param {string} [options.delimiter=',']
 * @returns {string}
 */
export function serializeCSV(rows, options = {}) {
  const delimiter = options.delimiter || ",";
  return rows
    .map(r =>
      r
        .map(cell => {
          if (cell == null) return "";
          const s = String(cell);
          if (s.includes('"') || s.includes(delimiter) || s.includes("\n") || s.includes("\r")) {
            return `"${s.replace(/"/g, '""')}"`;
          }
          return s;
        })
        .join(delimiter)
    )
    .join("\r\n");
}

/**
 * Convert a column letter(s) like "A", "Z", "AA" to 0-based index.
 *
 * @param {string} letters
 * @returns {number}
 */
export function columnLetterToIndex(letters) {
  let col = 0;
  const up = letters.toUpperCase();
  for (let i = 0; i < up.length; i++) {
    const ch = up.charCodeAt(i);
    if (ch < 65 || ch > 90) continue;
    col = col * 26 + (ch - 64);
  }
  return col - 1;
}

/**
 * Convert 0-based column index to column letters.
 *
 * @param {number} index
 * @returns {string}
 */
export function indexToColumnLetter(index) {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

/**
 * Parse a cell reference like "A1" -> {row:0, col:0}
 *
 * @param {string} ref
 * @returns {{row:number, col:number}}
 */
export function parseCellRef(ref) {
  const m = /^([A-Za-z]+)(\d+)$/.exec(ref.trim());
  if (!m) throw new Error(`Invalid cell reference: ${ref}`);
  return {
    col: columnLetterToIndex(m[1]),
    row: parseInt(m[2], 10) - 1,
  };
}

/**
 * Parse a range string like "A1:B2" or "A1" into {start:{row,col}, end:{row,col}}
 *
 * @param {string} rangeStr
 * @returns {{start:{row:number,col:number}, end:{row:number,col:number}}}
 */
export function parseRange(rangeStr) {
  const parts = rangeStr.split(":").map(s => s.trim());
  if (parts.length === 1) {
    const c = parseCellRef(parts[0]);
    return { start: c, end: c };
  }
  if (parts.length === 2) {
    const a = parseCellRef(parts[0]);
    const b = parseCellRef(parts[1]);
    const start = { row: Math.min(a.row, b.row), col: Math.min(a.col, b.col) };
    const end = { row: Math.max(a.row, b.row), col: Math.max(a.col, b.col) };
    return { start, end };
  }
  throw new Error(`Invalid range: ${rangeStr}`);
}

/**
 * Expand a range into list of cell refs as objects {row, col}
 *
 * @param {string} rangeStr
 * @returns {{row:number,col:number}[]}
 */
export function expandRange(rangeStr) {
  const { start, end } = parseRange(rangeStr);
  const cells = [];
  for (let r = start.row; r <= end.row; r++) {
    for (let c = start.col; c <= end.col; c++) {
      cells.push({ row: r, col: c });
    }
  }
  return cells;
}

/**
 * Evaluate a simple formula. Supports:
 * - Leading "=" optional
 * - SUM(range) and SUM(arg1,arg2,...)
 * - Basic arithmetic with cell refs and numeric literals: + - * / ^ and parentheses.
 * - Ranges inside SUM expand to their summed values.
 *
 * getCellValue is a function (row, col) => number | string
 *
 * Note: This is intentionally lightweight and not a full formula engine.
 *
 * @param {string} formula
 * @param {(row:number,col:number)=>any} getCellValue
 * @returns {number|string}
 */
export function evaluateFormula(formula, getCellValue) {
  if (!formula) return "";
  let expr = formula.trim();
  if (expr.startsWith("=")) expr = expr.substring(1).trim();

  // Handle SUM(...) specially because it accepts ranges and multiple args.
  expr = expr.replace(/SUM\s*\(([^)]+)\)/gi, (m, inner) => {
    const args = splitTopLevel(inner, ",");
    const vals = args.map(arg => {
      const a = arg.trim();
      if (/^[A-Za-z]+\d+(:[A-Za-z]+\d+)?$/i.test(a)) {
        if (a.includes(":")) {
          // range
          const cells = expandRange(a);
          return cells
            .map(c => numericValue(getCellValue(c.row, c.col)))
            .reduce((s, v) => s + v, 0);
        } else {
          const p = parseCellRef(a);
          return numericValue(getCellValue(p.row, p.col));
        }
      } else {
        // numeric or expression - try to evaluate as a number
        const n = Number(a);
        return Number.isFinite(n) ? n : 0;
      }
    });
    return String(vals.reduce((s, v) => s + v, 0));
  });

  // Replace ranges in arithmetic expressions by their summed numeric value
  expr = expr.replace(/[A-Za-z]+\d+:[A-Za-z]+\d+/g, r => {
    const cells = expandRange(r);
    return String(cells.map(c => numericValue(getCellValue(c.row, c.col))).reduce((s, v) => s + v, 0));
  });

  // Replace single cell refs with their numeric value (or quoted string if non-numeric)
  expr = expr.replace(/[A-Za-z]+\d+/g, ref => {
    const p = parseCellRef(ref);
    const val = getCellValue(p.row, p.col);
    const num = numericValue(val);
    if (Number.isFinite(num)) return String(num);
    // For non-numeric, wrap in quotes to allow string concatenation if used
    return JSON.stringify(String(val == null ? "" : val));
  });

  // Allow ^ as power
  expr = expr.replace(/\^/g, "**");

  // Evaluate expression safely by using Function. Keep simple.
  try {
    // Restrict to expression evaluation only
    // eslint-disable-next-line no-new-func
    const fn = new Function(`return (${expr});`);
    return fn();
  } catch (e) {
    // If evaluation fails, return original trimmed formula (fallback)
    return formula;
  }
}

function numericValue(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Split a string by top-level separators (not inside parentheses).
 *
 * @param {string} s
 * @param {string} sep
 * @returns {string[]}
 */
function splitTopLevel(s, sep) {
  const out = [];
  let buf = "";
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(") {
      depth++;
      buf += ch;
      continue;
    }
    if (ch === ")") {
      depth = Math.max(0, depth - 1);
      buf += ch;
      continue;
    }
    if (ch === sep && depth === 0) {
      out.push(buf);
      buf = "";
      continue;
    }
    buf += ch;
  }
  out.push(buf);
  return out;
}

// Provide a default export object and attach to window for direct browser usage.
const parsingUtils = {
  parseCSV,
  serializeCSV,
  columnLetterToIndex,
  indexToColumnLetter,
  parseCellRef,
  parseRange,
  expandRange,
  evaluateFormula,
};

if (typeof window !== "undefined") {
  window.parsingUtils = window.parsingUtils || {};
  Object.assign(window.parsingUtils, parsingUtils);
}

export default parsingUtils;