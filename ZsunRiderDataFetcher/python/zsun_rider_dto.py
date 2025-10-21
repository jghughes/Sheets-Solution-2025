"""
Module: zsun_rider_dto
----------------------

Defines the ZsunDTO data transfer object for representing Zwift rider profiles
and related performance metrics. This module uses Pydantic for data validation
and serialization, supporting flexible field aliasing and configuration.

Classes:
    - ZsunDTO: Main DTO for Zwift rider data, including identity, physical
      attributes, and various cycling performance metrics from Zwift, ZwiftPower,
      and ZwiftRacingApp sources.

Constants:
    - validation_alias_choices_map: Mapping for field alias validation.
    - configdictV1, preferred_config_dict: Pydantic configuration for aliasing.

Functions:
    - main02(): Example usage for loading, validating, and serializing rider data
      from JSON.

Usage:
    Import ZsunDTO to validate and serialize Zwift rider data across the
    application. Use main02() for demonstration or testing purposes.

Dependencies:
    - pydantic
    - jgh_read_write
    - jgh_serialization

"""

from pydantic import BaseModel, AliasChoices, ConfigDict, AliasGenerator
from typing import Optional
from jgh_read_write import *
from jgh_serialization import *


validation_alias_choices_map: dict[str, AliasChoices] = {}

configdictV1 = ConfigDict(
        alias_generator=AliasGenerator(
            alias=None,
            validation_alias=lambda field_name: validation_alias_choices_map.get(field_name, field_name)))

preferred_config_dict = configdictV1

class ZsunDTO(BaseModel):
    model_config                     = preferred_config_dict
    zwift_id                         : Optional[str]   = ""    # Zwift ID of the rider
    name                             : Optional[str]   = ""    # Name of the rider
    zwiftracingapp_country_alpha2   : Optional[str]   = ""    # Originates in Zwiftracingapp profile 2 letter name of country
    weight_kg                        : Optional[float] = 0.0   # Weight of the rider in kilograms
    height_cm                        : Optional[float] = 0.0   # Height of the rider in centimeters
    gender                           : Optional[str]   = ""    # Gender of the rider, m or f
    age_years                        : Optional[float] = 0.0   # Age of the rider in years
    age_group                         : Optional[str]   = ""    # Age group of the rider
    zwift_ftp_watts                     : Optional[float] = 0.0   # Originates in Zwift profile
    zwiftpower_zFTP_watts               : Optional[float] = 0.0   # Originates in Zwiftpower profile
    zwiftracingapp_zpFTP_watts          : Optional[float] = 0.0   # Originates in Zwiftracingapp profile
    zsun_one_hour_watts              : Optional[float] = 0.0   # Calculated by JGH
    zsun_CP_watts                       : Optional[float] = 0.0   # Critical power in watts
    zsun_AWC_kJ                         : Optional[float] = 0.0   # Critical power W' in kilojoules
    zwift_zrs_score                     : Optional[float] = 0.0   # Zwift racing score
    zwift_cat_open                      : Optional[str]   = ""    # A+, A, B, C, D, E. Originates in Zwift competitionMetrics.category
    zwift_cat_female                    : Optional[str]   = ""    # A+, A, B, C, D, E. Originates in Zwift competitionMetrics.categoryWomen
    zwiftracingapp_velo_rating_30_days             : Optional[float] = 0.0   # Velo score Originates in Zwiftracingapp, RaceDTO.max30, RaceDetailsDTO.rating
    zwiftracingapp_cat_num_30_days           : Optional[int]   = 0     # Velo rating 1 to 10
    zwiftracingapp_cat_name_30_days          : Optional[str]   = ""    # Copper, Silver, Gold etc
    zwiftracingapp_CP_watts             : Optional[float] = 0.0   # Critical power in watts
    zwiftracingapp_AWC_kJ               : Optional[float] = 0.0   # Anaerobic work capacity in kilojoules
    zsun_one_hour_curve_coefficient  : Optional[float] = 0.0   # Coefficient for FTP modeling
    zsun_one_hour_curve_exponent     : Optional[float] = 0.0   # Exponent for FTP modeling
    zsun_TTT_pull_curve_coefficient  : Optional[float] = 0.0   # Coefficient for pull modeling
    zsun_TTT_pull_curve_exponent     : Optional[float] = 0.0   # Exponent for pull modeling
    zsun_TTT_pull_curve_fit_r_squared: Optional[float] = 0.0   # R-squared value for the curve fit of the pull data
    zsun_when_curves_fitted          : Optional[str]   = ""    # Timestamp indicating when the models were fitted

def main02():
    import json

    # Simulate loading JSON data
    input_json = '''
    {
        "zwift_id": "123",
        "name": "null",
        "weight_kg": 70.5,
        "height_cm": 180,
        "gender": "m",
        "zwiftpower_zFTP_watts": null,
    }
    '''
    data = json.loads(input_json)

    # Validate and serialize
    rider = ZsunDTO(**data)
    print(rider)  # Check the validated model
    print(rider.model_dump())  # Check the serialized output

if __name__ == "__main__":
    main02()

