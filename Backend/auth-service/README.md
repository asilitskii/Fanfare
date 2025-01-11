# Auth Service

## Installation and launch

```bash
git clone ...
```

```bash
poetry shell
```

```bash
poetry install
```

```bash
fastapi run ./auth_service/app.py [--host HOST] [--port PORT]
```

> Before launching server you must launch MongoDB and User Service


## Logging

Default level of all logging is `DEBUG` and output is `stdout`. Logging can be configured only code (`auth_service/app.py`). Format of logs - JSON.

## Environment

You can find example of .env [here](example.env).

* `USER_SERVICE_CONNECTION_STRING` (it must include service prefix, all requests will be made to URL `{USER_SERVICE_CONNECTION_STRING}{path}` where path doesn't contain common service prefix. Example: connection string is http://1.1.1.1:1234/users and service has end-points `/users/first` и `/users/second`)
* `MONGO_CONNECTION_STRING`
* `MONGO_DATABASE_NAME` (name of database that will be created and used)
* `ACCESS_TOKEN_SECRET_KEY` (minLength=64)
* `ACCESS_TOKEN_EXPIRE_MINUTES` (>0)
* `ACCESS_TOKEN_ALGORITHM`
* `REFRESH_TOKEN_SECRET_KEY` (minLength=64)
* `REFRESH_TOKEN_EXPIRE_DAYS` (>0)
* `REFRESH_TOKEN_ALGORITHM`
* `DUMP_OPENAPI_SCHEMA` (default value: `False`)
* `OPENAPI_SCHEMA_FILE_NAME` (default value: `openapi.json`)

`ACCESS_TOKEN_SECRET_KEY` and `REFRESH_TOKEN_SECRET_KEY` must be as random as possible. You can use

```bash
openssl rand -hex 32
```

to generate these keys.
