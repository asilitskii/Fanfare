from datetime import datetime


def token_processor(logger, log_method, event_dict):
    if event_dict.get("token") is not None:
        token: str = event_dict["token"]
        event_dict["token"] = f"...{token[-8:]}"

    return event_dict


def token_type_processor(logger, log_method, event_dict):
    if event_dict.get("token_type") is not None:
        event_dict["token_type"] = event_dict["token_type"].value

    return event_dict


def exp_processor(logger, log_method, event_dict):
    if event_dict.get("exp") is not None:
        event_dict["exp"] = datetime.fromtimestamp(event_dict["exp"]).strftime(
            "%Y-%m-%dT%H:%M:%S"
        )

    return event_dict
