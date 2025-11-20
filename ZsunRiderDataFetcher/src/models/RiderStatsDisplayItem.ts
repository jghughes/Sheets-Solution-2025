import { ZwiftIdBase } from "./ZwiftIdBase";

export class RiderStatsDisplayItem extends ZwiftIdBase {
    name = "";
    country = "";
    age = 0.0;
    height = 0.0;
    weight = 0.0;
    gender = "";
    catOpen = "";
    catWomen = "";
    racingScore = 0.0;
    ftpW = 0.0;
    zFtpW = 0.0;
    zFtpWkg = 0.0;
    catLabel = "";
    raAgeGroup = "";
    raCatNum = 0;
    raCatOpen = "";
    raRating = 0.0;
    raCatLabel = "";
    "05sWkg" = 0.0;
    "15sWkg" = 0.0;
    "30sWkg" = 0.0;
    "01mWkg" = 0.0;
    "02mWkg" = 0.0;
    "03mWkg" = 0.0;
    "05mWkg" = 0.0;
    "10mWkg" = 0.0;
    "12mWkg" = 0.0;
    "15mWkg" = 0.0;
    "20mWkg" = 0.0;
    "30mWkg" = 0.0;
    "40mWkg" = 0.0;
    "60mWkg" = 0.0;
    "05sW" = 0.0;
    "15sW" = 0.0;
    "30sW" = 0.0;
    "01mW" = 0.0;
    "02mW" = 0.0;
    "03mW" = 0.0;
    "05mW" = 0.0;
    "10mW" = 0.0;
    "12mW" = 0.0;
    "15mW" = 0.0;
    "20mW" = 0.0;
    "30mW" = 0.0;
    "40mW" = 0.0;
    "60mW" = 0.0;
    timestamp = ""; // formatted ISO 8601 string, e.g., '2025-08-15T12:34:56.789Z'

    constructor(data?: Partial<RiderStatsDisplayItem>) {
        super();
        Object.assign(this, data);
    }
}
