import { isAlertMessageError } from "./ErrorUtils";

/**
 * Prints a brief message to the console for user feedback.
 * For AlertMessageError, prints the alert message.
 * For other errors, prints a generic message and refers to logs.
 */
export function printAlertOrError(error: any) {
    if (isAlertMessageError(error) && error.message) {
        // Handled alert
        console.log(`${error.message}\n`);
        // Optionally, surface to UI here
        showAlert(error.message);
    } else if (error && error.message) {
        // Unhandled error
        console.log(`Unhandled Exception: ${error.message}\n\nPlease check the logs for details.\n`);
    } else {
        // Fallback
        console.log("An error occurred. Please check the logs for details.\n");
    }
}

/**
 * Stub: Surfaces an alert message to the user interface.
 * Replace with actual UI logic as needed (e.g., SpreadsheetApp.getUi().alert in Apps Script).
 */
export function showAlert(message: string) {
    // TODO: Implement UI alert logic for your environment.
    // Example for Google Apps Script:
    // SpreadsheetApp.getUi().alert(message);
}