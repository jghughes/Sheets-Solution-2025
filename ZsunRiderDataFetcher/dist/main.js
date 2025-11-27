"use strict";
(() => {
  // src/utils/ErrorUtils.ts
  var serverErrorCode = {
    unexpectedError: "unexpected_error",
    noInternet: "no_internet",
    unauthorizedAccess: "unauthorized_access",
    timeout: "timeout",
    serviceUnavailable: "service_unavailable"
  };
  var alertMessageErrorCode = {
    userActionRequired: "user_action_required",
    info: "info",
    warning: "warning",
    businessRule: "business_rule",
    custom: "custom"
  };
  var ValidationError = class _ValidationError extends Error {
    constructor(code, message, context = {}) {
      super(message);
      this.name = "ValidationError";
      this.code = code;
      this.context = context;
      Object.setPrototypeOf(this, _ValidationError.prototype);
    }
    toJson() {
      return {
        name: this.name,
        code: this.code,
        message: this.message,
        context: this.context,
        stack: this.stack
      };
    }
  };
  var ServerError = class _ServerError extends Error {
    constructor(code, message, context = {}) {
      super(message);
      this.name = "ServerError";
      this.code = code;
      this.context = context;
      Object.setPrototypeOf(this, _ServerError.prototype);
    }
    toJson() {
      return {
        name: this.name,
        code: this.code,
        message: this.message,
        context: this.context,
        stack: this.stack
      };
    }
  };
  var AlertMessageError = class _AlertMessageError extends Error {
    constructor(code, message, context = {}) {
      super(message);
      this.name = "AlertMessageError";
      this.code = code;
      this.context = context;
      Object.setPrototypeOf(this, _AlertMessageError.prototype);
    }
    toJson() {
      return {
        name: this.name,
        code: this.code,
        message: this.message,
        context: this.context,
        stack: this.stack
      };
    }
  };
  function throwValidationError(errorCodeEnum, errorMessage, operationName, nameOfFunctionThatThrew, moreDetails) {
    throw new ValidationError(errorCodeEnum, errorMessage, {
      operationName,
      nameOfFunctionThatThrew,
      errorCode: errorCodeEnum,
      moreDetails
    });
  }
  function throwServerErrorWithContext(code, message, operationName, callsite, details) {
    throw new ServerError(code, message, {
      operationName,
      callsite,
      errorCode: code,
      details
    });
  }
  function throwAlertMessageError(code, message, operationName, callsite, details) {
    throw new AlertMessageError(code, message, {
      operationName,
      callsite,
      errorCode: code,
      details
    });
  }
  function isValidationError(err) {
    return err instanceof ValidationError;
  }
  function getErrorMessage(error) {
    if (error && typeof error.message === "string") {
      return error.message;
    }
    return String(error);
  }
  function toError(error) {
    return error instanceof Error ? error : void 0;
  }

  // src/utils/HttpUtils.ts
  function throwIfNoConnection() {
    const opName = "InternetCheck";
    if (typeof UrlFetchApp === "undefined") {
      throwAlertMessageError(
        alertMessageErrorCode.userActionRequired,
        "No internet connection. Please check your network and try again.",
        opName,
        "throwIfNoConnection"
      );
    }
    try {
      const resp = UrlFetchApp.fetch(
        "https://www.google.com",
        { muteHttpExceptions: true, timeout: 1e4 }
      );
      const code = resp && typeof resp.getResponseCode === "function" ? resp.getResponseCode() : void 0;
      if (typeof code === "number" && code >= 500) {
        throwAlertMessageError(
          alertMessageErrorCode.userActionRequired,
          "No internet connection detected. Please check your network and try again.",
          opName,
          "throwIfNoConnection"
        );
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      logEvent({
        message: "Internet connectivity check failed",
        level: LogLevel.ERROR,
        exception: toError(err),
        extraFields: { opName }
      });
      throwAlertMessageError(
        alertMessageErrorCode.userActionRequired,
        `Internet connectivity check failed: ${msg}`,
        opName,
        "throwIfNoConnection"
      );
    }
  }
  function fetchTextFileFromUrl(url, maxRetries = 2, timeoutMs = 3e4) {
    const opName = "HttpFetch";
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const resp = UrlFetchApp.fetch(
          url,
          { muteHttpExceptions: true, timeout: timeoutMs }
        );
        const code = resp && typeof resp.getResponseCode === "function" ? resp.getResponseCode() : void 0;
        const text = typeof resp.getContentText === "function" ? resp.getContentText() : "";
        if (typeof code === "number") {
          if (code >= 400 && code < 500) {
            throwAlertMessageError(
              alertMessageErrorCode.userActionRequired,
              "File not found. Please check the filename, link, or URL and try again.",
              opName,
              "getTextFromUrl",
              { url, statusCode: code, responseSnippet: (text || "").slice(0, 1e3) }
            );
          }
          if (code >= 500) {
            throwServerErrorWithContext(
              serverErrorCode.serviceUnavailable,
              `${opName} failed with HTTP ${code}`,
              opName,
              "getTextFromUrl",
              { url, statusCode: code }
            );
          }
          if (typeof resp.getContentText === "function") return resp.getContentText();
          throwAlertMessageError(
            alertMessageErrorCode.userActionRequired,
            "Unexpected fetch response shape. Please check the URL and try again.",
            opName,
            "getTextFromUrl",
            { url }
          );
        }
        if (resp && typeof resp.getContentText === "function") return resp.getContentText();
        throwAlertMessageError(
          alertMessageErrorCode.userActionRequired,
          "Unexpected http response shape. Please check the URL and try again.",
          opName,
          "getTextFromUrl",
          { url }
        );
      } catch (err) {
        const msg = getErrorMessage(err);
        const isTimeout = msg.toLowerCase().includes("timeout");
        logEvent({
          message: `Attempt ${attempt} failed in fetchTextFileFromUrl${isTimeout ? " (timeout)" : ""}`,
          level: LogLevel.ERROR,
          exception: toError(err),
          extraFields: { url, opName, attempt }
        });
        if (isTimeout && attempt < maxRetries) continue;
        if (isValidationError(err)) throw err;
        throwServerErrorWithContext(
          serverErrorCode.unexpectedError,
          `${opName} failed: ${msg}`,
          opName,
          "getTextFromUrl",
          { url, attempt }
        );
      }
    }
    throwAlertMessageError(
      alertMessageErrorCode.userActionRequired,
      `Failed to fetch file from URL after ${maxRetries} attempts. Please try again later.`,
      opName,
      "fetchTextFileFromUrl",
      { url }
    );
    return "";
  }

  // src/models/ZwiftIdBase.ts
  var ZwiftIdBase = class {
    constructor() {
      this.zwiftId = "";
    }
  };

  // src/models/RiderStatsDto.ts
  var aliasMap = {
    zwift_id: "zwiftId",
    full_name: "fullName",
    zwift_country_code3: "zwiftCountryCode3",
    age_years: "ageYears",
    height_cm: "heightCm",
    weight_kg: "weightKg",
    gender_code: "genderCode",
    cat_open: "catOpen",
    cat_women: "catWomen",
    zwift_racing_score: "zwiftRacingScore",
    zwift_ftp_w: "zwiftWattsFtp",
    zwift_zftp_w: "zwiftWattsZFtp",
    zwift_zftp_wkg: "zwiftWattsKgZFtp",
    zwift_cat_label: "zwiftCatLabel",
    velo_age_group: "veloAgeGroup",
    velo_cat_num_30_days: "veloCatNum30Days",
    velo_cat_name_30_days: "veloCatName30Days",
    velo_rating_30_days: "veloRating30Days",
    velo_cat_label: "veloCatLabel",
    wkg_05sec: "wkg05Sec",
    wkg_15sec: "wkg15Sec",
    wkg_30sec: "wkg30Sec",
    wkg_01min: "wkg01Min",
    wkg_02min: "wkg02Min",
    wkg_03min: "wkg03Min",
    wkg_05min: "wkg05Min",
    wkg_10min: "wkg10Min",
    wkg_12min: "wkg12Min",
    wkg_15min: "wkg15Min",
    wkg_20min: "wkg20Min",
    wkg_30min: "wkg30Min",
    wkg_40min: "wkg40Min",
    wkg_60min_curvefit: "wkg60MinCurveFit",
    w_05sec: "w05Sec",
    w_15sec: "w15Sec",
    w_30sec: "w30Sec",
    w_01min: "w01Min",
    w_02min: "w02Min",
    w_03min: "w03Min",
    w_05min: "w05Min",
    w_10min: "w10Min",
    w_12min: "w12Min",
    w_15min: "w15Min",
    w_20min: "w20Min",
    w_30min: "w30Min",
    w_40min: "w40Min",
    w_60min_curvefit: "w60MinCurveFit",
    timestamp: "timestamp"
  };
  var RiderStatsDto = class _RiderStatsDto extends ZwiftIdBase {
    // formatted ISO 8601 string, e.g., '2025-08-15T12:34:56.789Z'
    constructor(data) {
      super();
      this.fullName = "";
      this.zwiftCountryCode3 = "";
      this.ageYears = 0;
      this.heightCm = 0;
      this.weightKg = 0;
      this.genderCode = "";
      this.catOpen = "";
      this.catWomen = "";
      this.zwiftRacingScore = 0;
      this.zwiftWattsFtp = 0;
      this.zwiftWattsZFtp = 0;
      this.zwiftWattsKgZFtp = 0;
      this.zwiftCatLabel = "";
      this.veloAgeGroup = "";
      this.veloCatNum30Days = 0;
      this.veloCatName30Days = "";
      this.veloRating30Days = 0;
      this.veloCatLabel = "";
      this.wkg05Sec = 0;
      this.wkg15Sec = 0;
      this.wkg30Sec = 0;
      this.wkg01Min = 0;
      this.wkg02Min = 0;
      this.wkg03Min = 0;
      this.wkg05Min = 0;
      this.wkg10Min = 0;
      this.wkg12Min = 0;
      this.wkg15Min = 0;
      this.wkg20Min = 0;
      this.wkg30Min = 0;
      this.wkg40Min = 0;
      this.wkg60MinCurveFit = 0;
      this.w05Sec = 0;
      this.w15Sec = 0;
      this.w30Sec = 0;
      this.w01Min = 0;
      this.w02Min = 0;
      this.w03Min = 0;
      this.w05Min = 0;
      this.w10Min = 0;
      this.w12Min = 0;
      this.w15Min = 0;
      this.w20Min = 0;
      this.w30Min = 0;
      this.w40Min = 0;
      this.w60MinCurveFit = 0;
      this.timestamp = "";
      Object.assign(this, data);
    }
    // Deserialize from JSON with alias support
    static fromJson(json) {
      const item = new _RiderStatsDto();
      const keys = Object.keys(json);
      for (let i = 0; i < keys.length; i++) {
        const jsonKey = keys[i];
        const value = json[jsonKey];
        const prop = aliasMap[jsonKey];
        if (prop) {
          item[prop] = value;
        }
      }
      return item;
    }
    // Serialize to JSON using preferred aliases (second field in AliasChoices)
    toJson() {
      const result = {};
      const keys = Object.keys(aliasMap);
      for (let i = 0; i < keys.length; i++) {
        const jsonKey = keys[i];
        const prop = aliasMap[jsonKey];
        if (jsonKey === prop) {
          result[jsonKey] = this[prop];
        }
      }
      return result;
    }
    // Deserialize an array of JSON objects to an array of RiderStatsDto
    static fromJsonArray(jsonArray) {
      if (!Array.isArray(jsonArray)) return [];
      return jsonArray.map((obj) => _RiderStatsDto.fromJson(obj));
    }
    // Serialize an array of RiderStatsDto to an array of JSON objects
    static toJsonArray(arrayOfDto) {
      if (!Array.isArray(arrayOfDto)) return [];
      return arrayOfDto.map((dto) => dto.toJson());
    }
  };

  // src/models/RiderStatsDisplayItem.ts
  var RiderStatsDisplayItem = class extends ZwiftIdBase {
    // formatted ISO 8601 string, e.g., '2025-08-15T12:34:56.789Z'
    constructor(data) {
      super();
      this.name = "";
      this.country = "";
      this.age = 0;
      this.height = 0;
      this.weight = 0;
      this.gender = "";
      this.catOpen = "";
      this.catWomen = "";
      this.racingScore = 0;
      this.ftpW = 0;
      this.zFtpW = 0;
      this.zFtpWkg = 0;
      this.catLabel = "";
      this.raAgeGroup = "";
      this.raCatNum = 0;
      this.raCatOpen = "";
      this.raRating = 0;
      this.raCatLabel = "";
      this["05sWkg"] = 0;
      this["15sWkg"] = 0;
      this["30sWkg"] = 0;
      this["01mWkg"] = 0;
      this["02mWkg"] = 0;
      this["03mWkg"] = 0;
      this["05mWkg"] = 0;
      this["10mWkg"] = 0;
      this["12mWkg"] = 0;
      this["15mWkg"] = 0;
      this["20mWkg"] = 0;
      this["30mWkg"] = 0;
      this["40mWkg"] = 0;
      this["60mWkg"] = 0;
      this["05sW"] = 0;
      this["15sW"] = 0;
      this["30sW"] = 0;
      this["01mW"] = 0;
      this["02mW"] = 0;
      this["03mW"] = 0;
      this["05mW"] = 0;
      this["10mW"] = 0;
      this["12mW"] = 0;
      this["15mW"] = 0;
      this["20mW"] = 0;
      this["30mW"] = 0;
      this["40mW"] = 0;
      this["60mW"] = 0;
      this.timestamp = "";
      Object.assign(this, data);
    }
  };

  // src/models/RiderStatsItem.ts
  var RiderStatsItem = class _RiderStatsItem extends ZwiftIdBase {
    // formatted ISO 8601 string, e.g., '2025-08-15T12:34:56.789Z'
    constructor(data) {
      super();
      this.fullName = "";
      this.zwiftCountryCode3 = "";
      this.ageYears = 0;
      this.heightCm = 0;
      this.weightKg = 0;
      this.genderCode = "";
      this.catOpen = "";
      this.catWomen = "";
      this.zwiftRacingScore = 0;
      this.zwiftWattsFtp = 0;
      this.zwiftWattsZFtp = 0;
      this.zwiftWattsKgZFtp = 0;
      this.zwiftCatLabel = "";
      this.veloAgeGroup = "";
      this.veloCatNum30Days = 0;
      this.veloCatName30Days = "";
      this.veloRating30Days = 0;
      this.veloCatLabel = "";
      this.wkg05Sec = 0;
      this.wkg15Sec = 0;
      this.wkg30Sec = 0;
      this.wkg01Min = 0;
      this.wkg02Min = 0;
      this.wkg03Min = 0;
      this.wkg05Min = 0;
      this.wkg10Min = 0;
      this.wkg12Min = 0;
      this.wkg15Min = 0;
      this.wkg20Min = 0;
      this.wkg30Min = 0;
      this.wkg40Min = 0;
      this.wkg60MinCurveFit = 0;
      this.w05Sec = 0;
      this.w15Sec = 0;
      this.w30Sec = 0;
      this.w01Min = 0;
      this.w02Min = 0;
      this.w03Min = 0;
      this.w05Min = 0;
      this.w10Min = 0;
      this.w12Min = 0;
      this.w15Min = 0;
      this.w20Min = 0;
      this.w30Min = 0;
      this.w40Min = 0;
      this.w60MinCurveFit = 0;
      this.timestamp = "";
      Object.assign(this, data);
    }
    static toDataTransferObject(item) {
      if (!item) {
        return new RiderStatsDto();
      }
      return new RiderStatsDto(Object.assign({}, item));
    }
    static fromDataTransferObject(dto) {
      if (!dto) {
        return new _RiderStatsItem();
      }
      return new _RiderStatsItem(Object.assign({}, dto));
    }
    static fromDtoArray(dtos) {
      if (!Array.isArray(dtos)) return [];
      return dtos.map((dto) => _RiderStatsItem.fromDataTransferObject(dto));
    }
    static toDtoArray(items) {
      if (!Array.isArray(items)) return [];
      return items.map((item) => _RiderStatsItem.toDataTransferObject(item));
    }
    static toDisplayItem(item) {
      const display = new RiderStatsDisplayItem();
      if (!item) return display;
      display.zwiftId = item.zwiftId;
      display.name = item.fullName;
      display.country = item.zwiftCountryCode3;
      display.age = item.ageYears;
      display.height = item.heightCm;
      display.weight = item.weightKg;
      display.gender = item.genderCode;
      display.catOpen = item.catOpen;
      display.catWomen = item.catWomen;
      display.racingScore = item.zwiftRacingScore;
      display.ftpW = item.zwiftWattsFtp;
      display.zFtpW = item.zwiftWattsZFtp;
      display.zFtpWkg = item.zwiftWattsKgZFtp;
      display.catLabel = item.zwiftCatLabel;
      display.raAgeGroup = item.veloAgeGroup;
      display.raCatNum = item.veloCatNum30Days;
      display.raCatOpen = item.veloCatName30Days;
      display.raRating = item.veloRating30Days;
      display.raCatLabel = item.veloCatLabel;
      display["05sWkg"] = item.wkg05Sec;
      display["15sWkg"] = item.wkg15Sec;
      display["30sWkg"] = item.wkg30Sec;
      display["01mWkg"] = item.wkg01Min;
      display["02mWkg"] = item.wkg02Min;
      display["03mWkg"] = item.wkg03Min;
      display["05mWkg"] = item.wkg05Min;
      display["10mWkg"] = item.wkg10Min;
      display["12mWkg"] = item.wkg12Min;
      display["15mWkg"] = item.wkg15Min;
      display["20mWkg"] = item.wkg20Min;
      display["30mWkg"] = item.wkg30Min;
      display["40mWkg"] = item.wkg40Min;
      display["60mWkg"] = item.wkg60MinCurveFit;
      display["05sW"] = item.w05Sec;
      display["15sW"] = item.w15Sec;
      display["30sW"] = item.w30Sec;
      display["01mW"] = item.w01Min;
      display["02mW"] = item.w02Min;
      display["03mW"] = item.w03Min;
      display["05mW"] = item.w05Min;
      display["10mW"] = item.w10Min;
      display["12mW"] = item.w12Min;
      display["15mW"] = item.w15Min;
      display["20mW"] = item.w20Min;
      display["30mW"] = item.w30Min;
      display["40mW"] = item.w40Min;
      display["60mW"] = item.w60MinCurveFit;
      display.timestamp = item.timestamp;
      return display;
    }
    static toDisplayItemArray(items) {
      if (!Array.isArray(items)) return [];
      return items.map((item) => _RiderStatsItem.toDisplayItem(item));
    }
    toDisplayItemDictionary(items) {
      const dict = {};
      if (!Array.isArray(items)) return dict;
      for (const item of items) {
        if (item && typeof item.zwiftId === "string" && item.zwiftId.length > 0) {
          dict[item.zwiftId] = item;
        }
      }
      return dict;
    }
  };

  // src/services/RiderStatsDataService.ts
  var invalidFileFormat = "invalid_file_format";
  var methodName = "fetchRiderStatsItemsFromUrl";
  function fetchRiderStatsItemsFromUrl(url) {
    throwIfNoConnection();
    const text = fetchTextFileFromUrl(url);
    let jsonArray = [];
    try {
      jsonArray = JSON.parse(text);
      if (!Array.isArray(jsonArray)) {
        throw new Error("JSON is not an array.");
      }
    } catch (err1) {
      throwValidationError(
        invalidFileFormat,
        `File content is not a valid JSON array. ${getErrorMessage(err1)}`,
        methodName,
        url,
        { exception: toError(err1) }
      );
      return [];
    }
    let dtoArray;
    try {
      dtoArray = RiderStatsDto.fromJsonArray(jsonArray);
    } catch (err2) {
      throwValidationError(
        invalidFileFormat,
        `Failed to convert JSON array to RiderStatsDto array. ${getErrorMessage(err2)}`,
        methodName,
        url,
        { exception: toError(err2) }
      );
      return [];
    }
    let answer;
    try {
      answer = RiderStatsItem.fromDtoArray(dtoArray);
    } catch (err3) {
      throwValidationError(
        invalidFileFormat,
        `Failed to map RiderStatsDto array to RiderStatsItem array. ${getErrorMessage(err3)}`,
        methodName,
        url,
        { exception: toError(err3) }
      );
      return [];
    }
    return answer;
  }

  // src/utils/LoggerUtils.ts
  function logEvent2(options) {
    const {
      message,
      level,
      exception,
      extraFields
    } = options;
    const logEntry = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      level,
      message
    };
    if (exception) {
      if (typeof exception.toJson === "function") {
        const errorJson = exception.toJson();
        Object.assign(logEntry, {
          name: errorJson.name,
          code: errorJson.code,
          errorMessage: errorJson.message,
          stack: errorJson.stack
        });
        if (errorJson.context && typeof errorJson.context === "object") {
          Object.assign(logEntry, errorJson.context);
        }
      } else {
        logEntry["exception"] = {
          name: exception.name || "Error",
          message: exception.message || String(exception),
          stack: exception.stack || null
        };
      }
    }
    if (extraFields && typeof extraFields === "object") {
      Object.assign(logEntry, extraFields);
    }
    logJson(logEntry);
  }
  function logJson(entry) {
    const json = JSON.stringify(entry);
    if (typeof Logger !== "undefined" && typeof Logger.log === "function") {
      Logger.log(json);
    } else {
      console.log(json);
    }
  }

  // src/utils/SheetUtils.ts
  function ensureSheetExists(sheetServiceInstance, sheetName, clearIfExists = false) {
    if (!sheetServiceInstance.sheetExists(sheetName)) {
      sheetServiceInstance.insertSheet(sheetName);
    } else if (clearIfExists) {
      sheetServiceInstance.clearSheet(sheetName);
    }
  }
  function logSpreadsheetServiceError(message, error, sheetName, operation) {
    const errorType = typeof error === "object" && error !== null && "code" in error ? error.code : typeof error === "object" && error !== null && "name" in error ? error.name : void 0;
    logEvent2({
      message,
      level: "ERROR" /* ERROR */,
      exception: toError(error),
      extraFields: {
        sheetName,
        operation,
        errorType,
        errorMessage: getErrorMessage(error)
      }
    });
  }
  function isValidZwiftIdInCell(zwiftId) {
    if (typeof zwiftId === "string" && /^[0-9]+$/.test(zwiftId)) {
      return true;
    }
    if (typeof zwiftId === "number" && Number.isInteger(zwiftId) && zwiftId >= 0) {
      return true;
    }
    return false;
  }
  function toZwiftIdString(zwiftId) {
    return typeof zwiftId === "string" ? zwiftId : zwiftId.toString();
  }

  // src/utils/ReflectionUtils.ts
  function getPropertyNames(records) {
    if (!records || records.length === 0 || typeof records[0] !== "object" || records[0] === null) return [];
    const propertyNames = Object.keys(records[0]);
    const zwiftIdIndex = propertyNames.indexOf("zwiftId");
    if (zwiftIdIndex > 0) {
      propertyNames.splice(zwiftIdIndex, 1);
      propertyNames.unshift("zwiftId");
    }
    return propertyNames;
  }

  // src/utils/CollectionUtils.ts
  function toZwiftIdDictionary(items) {
    const dict = {};
    if (!Array.isArray(items)) return dict;
    for (const item of items) {
      if (item && typeof item.zwiftId === "string" && item.zwiftId.length > 0) {
        dict[item.zwiftId] = item;
      }
    }
    return dict;
  }

  // src/services/SheetRowManager.ts
  function writeSheetRowsByZwiftId(sheetServiceInstance, sheetName, records) {
    sheetName = sheetName || "Dump";
    try {
      ensureSheetExists(sheetServiceInstance, sheetName, true);
      if (!records || records.length === 0) {
        sheetServiceInstance.updateRow(sheetName, 1, ["Zwift ID"]);
        const message = `Nothing for ${sheetName}`;
        logEvent2({
          message,
          level: "INFO" /* INFO */,
          extraFields: { sheetName }
        });
        return message;
      }
      const propertyNames = getPropertyNames(records);
      sheetServiceInstance.updateRow(sheetName, 1, propertyNames);
      const dataRows = [];
      let missingZwiftIdCount = 0;
      for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
        const record = records[recordIndex];
        const zwiftId = record && record["zwiftId"];
        if (!isValidZwiftIdInCell(zwiftId)) {
          missingZwiftIdCount++;
          logEvent2({
            message: `Missing zwiftId in record [${zwiftId}], skipping row in ${sheetName}`,
            level: "WARN" /* WARN */,
            extraFields: { sheetName, recordIndex }
          });
          continue;
        }
        const rowValues = propertyNames.map((propertyName) => {
          const value = record && record[propertyName] !== void 0 ? record[propertyName] : "";
          return value == null ? "" : String(value);
        });
        dataRows.push(rowValues);
      }
      let errorCount = 0;
      if (dataRows.length > 0) {
        try {
          sheetServiceInstance.updateContiguousRows(sheetName, 2, dataRows);
        } catch (setValuesError) {
          errorCount += dataRows.length;
          logSpreadsheetServiceError(
            `API error during updateContiguousRows in writeSheetRowsByZwiftId`,
            setValuesError,
            sheetName,
            "updateContiguousRows"
          );
        }
      }
      logEvent2({
        message: `writeSheetRowsByZwiftId summary`,
        level: "INFO" /* INFO */,
        extraFields: {
          sheetName,
          missingZwiftIdCount,
          errorCount,
          writtenCount: dataRows.length
        }
      });
      return `${dataRows.length} updates in "${sheetName}"`;
    } catch (mainError) {
      logSpreadsheetServiceError(
        `writeSheetRowsByZwiftId error`,
        mainError,
        sheetName,
        "updateContiguousRows"
      );
      throwServerErrorWithContext(
        serverErrorCode.unexpectedError,
        `Failed to write data to sheet: ${getErrorMessage(mainError)}`,
        "writeSheetRowsByZwiftId",
        "updateContiguousRows",
        { sheetName }
      );
      return "";
    }
  }
  function updateSheetRowsByZwiftId(sheetServiceInstance, sheetName, items, maxRowLimit) {
    sheetName = sheetName || "Squad";
    if (typeof maxRowLimit !== "number") {
      maxRowLimit = 1e3;
    }
    try {
      ensureSheetExists(sheetServiceInstance, sheetName);
      if (!items || items.length === 0) {
        const message = `Nothing for ${sheetName}`;
        logEvent2({
          message,
          level: "INFO" /* INFO */,
          extraFields: { sheetName }
        });
        return message;
      }
      const propertyNames = getPropertyNames(items);
      sheetServiceInstance.updateRow(sheetName, 10, propertyNames);
      const zwiftIdDictionary = toZwiftIdDictionary(items);
      let validIdsInDictionary = 0;
      const keys = Object.keys(zwiftIdDictionary);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (isValidZwiftIdInCell(key)) {
          validIdsInDictionary++;
        }
      }
      const allSheetRows = sheetServiceInstance.getAllRows(sheetName);
      const rowLimit = Math.min(allSheetRows.length, maxRowLimit);
      const updatedRows = [];
      let overwriteCount = 0;
      let errorCount = 0;
      let totalValidIds = 0;
      for (let rowIndex = 11; rowIndex <= rowLimit; rowIndex++) {
        const sheetRow = allSheetRows[rowIndex - 1];
        const firstCellValue = sheetRow && sheetRow[0];
        if (!isValidZwiftIdInCell(firstCellValue)) {
          updatedRows.push(sheetRow);
          continue;
        }
        totalValidIds++;
        let zwiftIdString = toZwiftIdString(firstCellValue);
        let record = zwiftIdDictionary[zwiftIdString];
        if (!record) {
          record = { zwiftId: zwiftIdString };
        }
        const updatedRow = propertyNames.map(
          (propertyName) => record && record[propertyName] !== void 0 ? record[propertyName] : ""
        );
        updatedRows.push(updatedRow);
        overwriteCount++;
      }
      if (updatedRows.length > 0) {
        try {
          sheetServiceInstance.updateContiguousRows(sheetName, 11, updatedRows);
        } catch (setValuesError) {
          errorCount += updatedRows.length;
          logSpreadsheetServiceError(
            `API error during updateContiguousRows in updateSheetRowsByZwiftId`,
            setValuesError,
            sheetName,
            "updateContiguousRows"
          );
        }
      }
      logEvent2({
        message: `updateSheetRowsByZwiftId summary`,
        level: "INFO" /* INFO */,
        extraFields: {
          sheetName,
          overwriteCount,
          errorCount,
          totalValidIds
        }
      });
      logEvent2({
        message: `Valid Zwift IDs found in dictionary`,
        level: "INFO" /* INFO */,
        extraFields: {
          sheetName,
          validIdsInDictionary
        }
      });
      return `${overwriteCount} updates in "${sheetName}"`;
    } catch (mainError) {
      logSpreadsheetServiceError(
        `updateSheetRowsByZwiftId error`,
        mainError,
        sheetName,
        "updateContiguousRows"
      );
      throwServerErrorWithContext(
        serverErrorCode.unexpectedError,
        `Failed to update data in sheet: ${getErrorMessage(mainError)}`,
        "updateSheetRowsByZwiftId",
        "updateContiguousRows",
        { sheetName }
      );
      return "";
    }
  }

  // src/storage_config.ts
  var defaultStorageAccount = "customerzsun";
  var defaultContainer = "preprocessed";
  var defaultBlobName = "rider_stats_dto_as_list.json";
  var defaultSourceUrlForRidersOnAzure = `https://${defaultStorageAccount}.blob.core.windows.net/${defaultContainer}/${defaultBlobName}`;

  // src/services/SpreadsheetService.ts
  var SpreadsheetService = class {
    constructor(spreadsheet) {
      this.spreadsheet = spreadsheet;
    }
    sheetExists(name) {
      return !!this.spreadsheet.getSheetByName(name);
    }
    insertSheet(name) {
      this.spreadsheet.insertSheet(name);
    }
    deleteSheet(name) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) this.spreadsheet.deleteSheet(sheet);
    }
    renameSheet(oldName, newName) {
      const sheet = this.spreadsheet.getSheetByName(oldName);
      if (sheet) sheet.setName(newName);
    }
    clearSheet(name) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) sheet.clear();
    }
    appendRow(name, row) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) sheet.appendRow(row);
    }
    setValues(name, startRow, startCol, numRows, numCols, values) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        sheet.getRange(startRow, startCol, numRows, numCols).setValues(values);
      }
    }
    updateRow(name, rowIdx, values) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        sheet.getRange(rowIdx, 1, 1, values.length).setValues([values]);
      }
    }
    getRow(name, rowIdx) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        const range = sheet.getRange(rowIdx, 1, 1, sheet.getLastColumn());
        const values = range.getValues();
        return values[0] !== void 0 ? values[0] : null;
      }
      return null;
    }
    getAllRows(name) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        const lastRow = sheet.getLastRow();
        const lastCol = sheet.getLastColumn();
        if (lastRow > 0 && lastCol > 0) {
          return sheet.getRange(1, 1, lastRow, lastCol).getValues();
        }
      }
      return [];
    }
    getColumn(name, colIdx) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        const lastRow = sheet.getLastRow();
        if (lastRow > 0) {
          return sheet.getRange(1, colIdx, lastRow, 1).getValues().map((row) => row[0]);
        }
      }
      return [];
    }
    getSheetNames() {
      return this.spreadsheet.getSheets().map((sheet) => sheet.getName());
    }
    getCellValue(name, rowIdx, colIdx) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        const value = sheet.getRange(rowIdx, colIdx, 1, 1).getValue();
        return value;
      }
      return null;
    }
    setCellValue(name, rowIdx, colIdx, value) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        sheet.getRange(rowIdx, colIdx, 1, 1).setValue(value);
      }
    }
    getSpreadsheetTimeZone() {
      try {
        return this.spreadsheet.getSpreadsheetTimeZone() || "Etc/UTC";
      } catch (err) {
        return "Etc/UTC";
      }
    }
    // Row/Column Insert/Delete
    insertRow(name, rowIdx) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        sheet.insertRows(rowIdx, 1);
      }
    }
    deleteRow(name, rowIdx) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        sheet.deleteRow(rowIdx);
      }
    }
    insertColumn(name, colIdx) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        sheet.insertColumns(colIdx, 1);
      }
    }
    deleteColumn(name, colIdx) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        sheet.deleteColumn(colIdx);
      }
    }
    // Range Operations
    getRangeValues(name, startRow, startCol, numRows, numCols) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet) {
        return sheet.getRange(startRow, startCol, numRows, numCols).getValues();
      }
      return [];
    }
    setRangeValues(name, startRow, startCol, values) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (sheet && values.length > 0 && values[0] !== void 0 && values[0].length > 0) {
        sheet.getRange(startRow, startCol, values.length, values[0].length).setValues(values);
      }
    }
    /**
     * Updates a contiguous range of rows in the specified sheet.
     * @param name - The name of the sheet.
     * @param startRow - The 1-based index of the first row to update.
     * @param rows - An array of row arrays, each representing the values for a row.
     *               Each row must have the same number of columns.
     */
    updateContiguousRows(name, startRow, rows) {
      const sheet = this.spreadsheet.getSheetByName(name);
      if (!sheet || rows.length === 0 || rows[0] === void 0 || rows[0].length === 0) return;
      const numRows = rows.length;
      const numCols = rows[0].length;
      sheet.getRange(startRow, 1, numRows, numCols).setValues(rows);
    }
    /**
     * Returns the last row with data in the specified sheet.
     * @param name - The name of the sheet.
     */
    getLastRow(name) {
      const sheet = this.spreadsheet.getSheetByName(name);
      return sheet ? sheet.getLastRow() : 0;
    }
  };

  // src/main.ts
  function importRidersFromUrl() {
    try {
      const sheetServiceInstance = new SpreadsheetService(SpreadsheetApp.getActiveSpreadsheet());
      const importedRecords = fetchRiderStatsItemsFromUrl(defaultSourceUrlForRidersOnAzure);
      const riderStatsDisplayItems = RiderStatsItem.toDisplayItemArray(importedRecords);
      const message1 = writeSheetRowsByZwiftId(sheetServiceInstance, "Dump", riderStatsDisplayItems);
      const message2 = updateSheetRowsByZwiftId(sheetServiceInstance, "Squad", riderStatsDisplayItems);
      const message = `${message1} and ${message2}.`;
      return message;
    } catch (importError) {
      const errorMessage = getErrorMessage(importError);
      logEvent2({
        message: `importRidersFromUrl error: ${errorMessage}`,
        level: "ERROR" /* ERROR */,
        exception: toError(importError)
      });
      throwAlertMessageError(
        alertMessageErrorCode.userActionRequired,
        "Unable to import rider data. Please check the source URL and your spreadsheet, then try again.",
        "importRidersFromUrl",
        "importRidersFromUrl"
      );
    }
    throw new Error("Unreachable code in importRidersFromUrl");
  }
  function onInstall() {
    try {
      onOpen();
    } catch (installError) {
      const errorMessage = getErrorMessage(installError);
      logEvent2({
        message: `onInstall error: ${errorMessage}`,
        level: "ERROR" /* ERROR */,
        exception: toError(installError)
      });
      if (isValidationError(installError)) throw installError;
      throwServerErrorWithContext(
        serverErrorCode.unexpectedError,
        `onInstall failed: ${errorMessage}`,
        "onInstall",
        "onInstall",
        {}
      );
    }
    throw new Error("Unreachable code in onInstall");
  }
  function onOpen() {
    try {
      const spreadsheetUi = SpreadsheetApp.getUi();
      spreadsheetUi.createMenu("Rider Stats").addItem("Open Sidebar", "showSidebar").addToUi();
    } catch (openError) {
      const errorMessage = getErrorMessage(openError);
      logEvent2({
        message: `onOpen error: ${errorMessage}`,
        level: "ERROR" /* ERROR */,
        exception: toError(openError)
      });
      throwAlertMessageError(
        alertMessageErrorCode.userActionRequired,
        "Unable to access the Google Sheets UI. Please ensure you have a spreadsheet open and try again.",
        "onOpen",
        "onOpen"
      );
    }
    throw new Error("Unreachable code in onOpen");
  }
  function showSidebar() {
    try {
      const sidebarHtml = HtmlService.createHtmlOutputFromFile("ui/Sidebar").setTitle("Refresh stats").setWidth(320);
      SpreadsheetApp.getUi().showSidebar(sidebarHtml);
    } catch (sidebarError) {
      const errorMessage = getErrorMessage(sidebarError);
      logEvent2({
        message: `showSidebar error: ${errorMessage}`,
        level: "ERROR" /* ERROR */,
        exception: toError(sidebarError)
      });
      throwAlertMessageError(
        alertMessageErrorCode.userActionRequired,
        "Unable to display the sidebar. Please ensure you have a spreadsheet open and try again.",
        "showSidebar",
        "showSidebar"
      );
    }
    throw new Error("Unreachable code in showSidebar");
  }
  globalThis.importRidersFromUrl = importRidersFromUrl;
  globalThis.onInstall = onInstall;
  globalThis.showSidebar = showSidebar;
  globalThis.onOpen = onOpen;
})();
