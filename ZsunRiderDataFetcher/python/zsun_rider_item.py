from dataclasses import dataclass
from typing import Optional
import numpy as np
from jgh_number import safe_divide
from zsun_rider_dto import ZsunDTO 
from jgh_power_curve_fit_models import decay_model_numpy

@dataclass(frozen=True, eq=True)  # immutable and hashable, we use this as a dictionary key everywhere
class ZsunItem:
    """
    A frozen data class representing a Zwift rider.
    Can be used as a cache key or dictionary key, or in a set.
    """

    zwift_id                          : str   = ""    # Zwift ID of the rider
    name                              : str   = ""    # Name of the rider
    zwiftracingapp_country_alpha2   : Optional[str]   = ""    # 2 letter name of country
    weight_kg                         : float = 0.0   # Weight of the rider in kilograms
    height_cm                         : float = 0.0   # Height of the rider in centimeters
    gender                            : str   = ""    # Gender of the rider
    age_years                         : float = 0.0   # Age of the rider in years
    age_group                          : str   = ""    # Age group of the rider
    zwift_ftp_watts                         : float = 0.0   # Originates in Zwift profile
    zwiftpower_zFTP_watts                   : float = 0.0   # Originates in Zwiftpower profile
    zwiftracingapp_zpFTP_watts              : float = 0.0   # Originates in Zwiftracingapp profile
    zsun_one_hour_watts               : float = 0.0   # Calculated by JGH
    zsun_CP_watts                           : float = 0.0   # Critical power in watts
    zsun_AWC_kJ                          : float = 0.0   # Critical power W' in kilojoules
    zwift_zrs_score                         : float = 0.0   # Zwift racing score
    zwift_cat_open                         : str   = ""    # A+, A, B, C, D, E
    zwift_cat_female                         : str   = ""    # A+, A, B, C, D, E
    zwiftracingapp_velo_rating_30_days  : float = 0.0   # Velo rating we all use
    zwiftracingapp_cat_num_30_days            : int   = 0     # Velo category 1 to 10
    zwiftracingapp_cat_name_30_days           : str   = ""    # Copper, Silver, Gold etc
    zwiftracingapp_CP_watts                 : float = 0.0   # Critical power in watts
    zwiftracingapp_AWC_kJ                : float = 0.0   # Anaerobic work capacity in kilojoules
    zsun_one_hour_curve_coefficient   : float = 0.0   # Coefficient for FTP modeling
    zsun_one_hour_curve_exponent      : float = 0.0   # Exponent for FTP modeling
    zsun_TTT_pull_curve_coefficient   : float = 0.0   # Coefficient for pull modeling
    zsun_TTT_pull_curve_exponent      : float = 0.0   # Exponent for pull modeling
    zsun_TTT_pull_curve_fit_r_squared : float = 0.0   # R-squared value for the curve fit of the FTP data
    zsun_when_curves_fitted           : str   = ""    # Timestamp indicating when the models were fitted

    @staticmethod
    def create(zwiftid: str, name: str, weight_kg: float, height_cm: float, gender: str, 
        zwiftpower_zFTP_watts: float, zwift_zrs_score: int, zwiftracingapp_cat_num_30_days: int
    ) -> 'ZsunItem':
        """
        Create a ZsunItem instance with the given parameters

        Args:
           zwift_id            (int)  : The Zwift ID of the rider.
            name               (str)  : The name of the rider.
            weight_kg             (float): The weight_kg of the rider in kilograms.
            height_cm             (float): The height_cm of the rider in centimeters.
            gender             (Gender): The gender of the rider.
            zwiftpower_zFTP_watts                (float): Functional Threshold Power in watts.
            zwift_zrs_score (int)  : Zwift racing score.
            zwiftracingapp_cat_num_30_days        (int)  : Velo rating.
    
        Returns:
            ZsunItem: A ZsunItem instance with the given parameters.
        """

        instance = ZsunItem(
            zwift_id=zwiftid,
            name=name,
            weight_kg=weight_kg,
            height_cm=height_cm,
            gender=gender,
            zwiftpower_zFTP_watts=zwiftpower_zFTP_watts,
            zwift_zrs_score=zwift_zrs_score,
            zwiftracingapp_cat_num_30_days=zwiftracingapp_cat_num_30_days
        )

        return instance

    def get_30sec_strength_wkg(self) -> float:
        if self.weight_kg == 0:
            return safe_divide(self.get_standard_30sec_pull_watts(),80.0) # arbitrary default 80kg
        return safe_divide(self.get_standard_30sec_pull_watts(),self.weight_kg)

    def get_1_minute_strength_wkg(self) -> float:
        if self.weight_kg == 0:
            return safe_divide(self.get_standard_1_minute_pull_watts(),80.0) # arbitrary default 80kg
        return safe_divide(self.get_standard_1_minute_pull_watts(),self.weight_kg)

    def get_40_minute_strength_wkg(self) -> float:
        if self.weight_kg == 0:
            return safe_divide(self.get_standard_40_minute_pull_watts(),80.0) # arbitrary default 80kg
        return safe_divide(self.get_standard_40_minute_pull_watts(),self.weight_kg)

    def get_1_hour_strength_wkg(self) -> float:
        if self.weight_kg == 0:
            return safe_divide(self.get_one_hour_watts(),80.0) # arbitrary default 80kg
        return safe_divide(self.get_one_hour_watts(),self.weight_kg)

    def get_zwiftracingapp_zpFTP_strength_wkg(self) -> float:
        if self.weight_kg == 0:
            return safe_divide(self.zwiftracingapp_zpFTP_watts,80.0) # arbitrary default 80kg
        return safe_divide(self.zwiftracingapp_zpFTP_watts,self.weight_kg)

    def get_standard_pull_watts(self, seconds : float)-> float:

        permissable_watts = self.get_one_hour_watts() # default

        if seconds == 0:
            permissable_watts = self.get_standard_30sec_pull_watts()
        if seconds == 30:
            permissable_watts = self.get_standard_30sec_pull_watts()
        if seconds == 60:
            permissable_watts = self.get_standard_1_minute_pull_watts()
        if seconds == 120:
            permissable_watts = self.get_standard_2_minute_pull_watts()
        if seconds == 180:
            permissable_watts = self.get_standard_3_minute_pull_watts()
        if seconds == 240:
            permissable_watts = self.get_standard_4_minute_pull_watts()
         
        return permissable_watts

    def get_standard_30sec_pull_watts(self) -> float:
        # apply 3.5 minute watts
        pull_short = decay_model_numpy(np.array([210]), self.zsun_TTT_pull_curve_coefficient, self.zsun_TTT_pull_curve_exponent)
        one_hour = decay_model_numpy(np.array([210]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)
        answer = max(pull_short[0], one_hour[0])
        return answer

    def get_standard_1_minute_pull_watts(self) -> float:
        # apply 5 minute watts
        pull_medium = decay_model_numpy(np.array([300]), self.zsun_TTT_pull_curve_coefficient, self.zsun_TTT_pull_curve_exponent)
        one_hour = decay_model_numpy(np.array([300]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)
        answer = max(pull_medium[0], one_hour[0])
        return answer

    def get_standard_2_minute_pull_watts(self) -> float:
        # # apply 12 minute watts
        pull_long = decay_model_numpy(np.array([720]), self.zsun_TTT_pull_curve_coefficient, self.zsun_TTT_pull_curve_exponent)
        one_hour = decay_model_numpy(np.array([720]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)
        answer = max(pull_long[0], one_hour[0])
        return answer

    def get_standard_3_minute_pull_watts(self) -> float:
        # apply 15 minute watts
        pull_long = decay_model_numpy(np.array([900]), self.zsun_TTT_pull_curve_coefficient, self.zsun_TTT_pull_curve_exponent)
        one_hour = decay_model_numpy(np.array([900]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)
        answer = max(pull_long[0], one_hour[0])
        return answer

    def get_standard_4_minute_pull_watts(self) -> float:
        # apply 18 minute watts
        one_hour = decay_model_numpy(np.array([1080]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)
        answer = one_hour[0]
        return answer

    def get_standard_5_minute_pull_watts(self) -> float:
        # apply 20 minute watts
        one_hour = decay_model_numpy(np.array([1200]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)
        answer = one_hour[0]
        return answer

    def get_standard_40_minute_pull_watts(self) -> float:
        # apply 40 minute watts
        one_hour = decay_model_numpy(np.array([2400]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)
        answer = one_hour[0]
        return answer

    def get_one_hour_watts(self) -> float:

        ftp = decay_model_numpy(np.array([3_600]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)

        answer =  ftp[0]

        return answer

    def get_one_hour_wkg(self) -> float:
        if self.weight_kg == 0:
            return 0.0
        return safe_divide( self.get_one_hour_watts(), self.weight_kg)

    def get_watts_per_kg(self, wattage : float) -> float:
        if self.weight_kg == 0:
            return 0.0
        return safe_divide(wattage,self.weight_kg)

    def get_n_second_watts(self, seconds: float) -> float:

        one_hour_curve = decay_model_numpy(np.array([seconds]), self.zsun_one_hour_curve_coefficient, self.zsun_one_hour_curve_exponent)

        if seconds < 900:
            pull_curve = decay_model_numpy(np.array([seconds]), self.zsun_TTT_pull_curve_coefficient, self.zsun_TTT_pull_curve_exponent)
            answer = max(pull_curve[0], one_hour_curve[0])

        elif seconds >= 900 and seconds < 1200:
            pull_curve = decay_model_numpy(np.array([seconds]), self.zsun_TTT_pull_curve_coefficient, self.zsun_TTT_pull_curve_exponent)
            # Linear transition from max(...) at 900s to one_hour_curve[0] at 1200s
            t = (seconds - 900) / 300.0
            start_val = max(pull_curve[0], one_hour_curve[0])
            end_val = one_hour_curve[0]
            answer = (1 - t) * start_val + t * end_val
        else: 
            answer = one_hour_curve[0]

        return answer

    def get_critical_power_watts(self) -> float:
        return self.zsun_CP_watts

    def get_anaerobic_work_capacity_kj(self) -> float:
        return safe_divide(self.zsun_AWC_kJ,1_000.0)

    def get_zwiftracingapp_zpFTP_wkg(self) -> float:
        if self.weight_kg == 0:
            return 0.0
        return safe_divide(self.zwiftracingapp_zpFTP_watts, self.weight_kg)

    def get_when_models_fitted(self) -> str:
        return self.zsun_when_curves_fitted

    @staticmethod
    def to_dataTransferObject(item: Optional["ZsunItem"]) -> ZsunDTO:
        if item is None:
            return ZsunDTO()
        return ZsunDTO(
            zwift_id                          = item.zwift_id,
            name                              = item.name,
            zwiftracingapp_country_alpha2                      = item.zwiftracingapp_country_alpha2,
            weight_kg                         = item.weight_kg,
            height_cm                         = item.height_cm,
            gender                            = item.gender,
            age_years                         = item.age_years,
            age_group                          = item.age_group,
            zwift_ftp_watts                     = item.zwift_ftp_watts,
            zwiftpower_zFTP_watts               = item.zwiftpower_zFTP_watts,
            zwiftracingapp_zpFTP_watts          = item.zwiftracingapp_zpFTP_watts,
            zsun_one_hour_watts               = item.get_one_hour_watts(),
            zsun_CP_watts                       = item.zsun_CP_watts,
            zsun_AWC_kJ                         = item.zsun_AWC_kJ,
            zwift_zrs_score                     = item.zwift_zrs_score,
            zwift_cat_open                      = item.zwift_cat_open,
            zwift_cat_female                    = item.zwift_cat_female,
            zwiftracingapp_velo_rating_30_days              = item.zwiftracingapp_velo_rating_30_days,
            zwiftracingapp_cat_num_30_days            = item.zwiftracingapp_cat_num_30_days,
            zwiftracingapp_cat_name_30_days           = item.zwiftracingapp_cat_name_30_days,
            zwiftracingapp_CP_watts             = item.zwiftracingapp_CP_watts,
            zwiftracingapp_AWC_kJ               = item.zwiftracingapp_AWC_kJ,
            zsun_one_hour_curve_coefficient   = item.zsun_one_hour_curve_coefficient,
            zsun_one_hour_curve_exponent      = item.zsun_one_hour_curve_exponent,
            zsun_TTT_pull_curve_coefficient   = item.zsun_TTT_pull_curve_coefficient,
            zsun_TTT_pull_curve_exponent      = item.zsun_TTT_pull_curve_exponent,
            zsun_TTT_pull_curve_fit_r_squared = item.zsun_TTT_pull_curve_fit_r_squared,
            zsun_when_curves_fitted           = item.zsun_when_curves_fitted,
        )

    @staticmethod
    def from_dataTransferObject(dto: Optional[ZsunDTO]) -> "ZsunItem":
        if dto is None:
            return ZsunItem()
        return ZsunItem(
            zwift_id                          = dto.zwift_id or "",
            name                              = dto.name or "",
            zwiftracingapp_country_alpha2                      = dto.zwiftracingapp_country_alpha2 or "",
            weight_kg                         = dto.weight_kg or 0.0,
            height_cm                         = dto.height_cm or 0.0,
            gender                            = dto.gender or "",
            age_years                         = dto.age_years or 0.0,
            age_group                          = dto.age_group or "",
            zwift_ftp_watts                     = dto.zwift_ftp_watts or 0.0,
            zwiftpower_zFTP_watts               = dto.zwiftpower_zFTP_watts or 0.0,
            zwiftracingapp_zpFTP_watts          = dto.zwiftracingapp_zpFTP_watts or 0.0,
            zsun_one_hour_watts               = dto.zsun_one_hour_watts or 0.0,
            zsun_CP_watts                       = dto.zsun_CP_watts or 0.0,
            zsun_AWC_kJ                         = dto.zsun_AWC_kJ or 0.0,
            zwift_zrs_score                     = dto.zwift_zrs_score or 0.0,
            zwift_cat_open                      = dto.zwift_cat_open or "",
            zwift_cat_female                    = dto.zwift_cat_female or "",
            zwiftracingapp_velo_rating_30_days              = dto.zwiftracingapp_velo_rating_30_days or 0.0,
            zwiftracingapp_cat_num_30_days            = dto.zwiftracingapp_cat_num_30_days or 0,
            zwiftracingapp_cat_name_30_days           = dto.zwiftracingapp_cat_name_30_days or "",
            zwiftracingapp_CP_watts             = dto.zwiftracingapp_CP_watts or 0.0,
            zwiftracingapp_AWC_kJ               = dto.zwiftracingapp_AWC_kJ or 0.0,
            zsun_one_hour_curve_coefficient   = dto.zsun_one_hour_curve_coefficient or 0.0,
            zsun_one_hour_curve_exponent      = dto.zsun_one_hour_curve_exponent or 0.0,
            zsun_TTT_pull_curve_coefficient   = dto.zsun_TTT_pull_curve_coefficient or 0.0,
            zsun_TTT_pull_curve_exponent      = dto.zsun_TTT_pull_curve_exponent or 0.0,
            zsun_TTT_pull_curve_fit_r_squared = dto.zsun_TTT_pull_curve_fit_r_squared or 0.0,
            zsun_when_curves_fitted           = dto.zsun_when_curves_fitted or "",
        )


