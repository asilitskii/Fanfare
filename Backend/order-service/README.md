# User Service

## Prerequirements

- Running postgres with database
- Python version >= 3.11

## Environment variables

- minimal example in file `example.env`

| NAME | Default value | Description |
|---|---|---|
| `POSTGRES_CONNECTION_STRING` | `postgresql+psycopg2://myuser:mypassword@localhost:5432/test` | string for postgres connection |
| `STORE_SERVICE_URL` | `http://localhost:8001` | store service url |

### Required Environment variables:

- `POSTGRES_CONNECTION_STRING`
- `STORE_SERVICE_URL`

## Installation and launch

### Python launch

1. Clone repo with ether:
    - `git clone https://gitlab.com/fanfarecorp/backend/order-service.git`
    - `git clone git@gitlab.com:fanfarecorp/backend/order-service.git`

2. Install requirements:
    - `pip install -r requirements.txt`

3. Run project
    - `fastapi dev order_service/app.py`

### Docker launch

> Untested
