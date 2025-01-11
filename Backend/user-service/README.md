# User Service

## Prerequirements

- Running postgres with database
- Python version >= 3.11

## Environment variables

- minimal example in file `example.env`

| NAME                                        | Default value                                                 | Description                                                                   |
|---------------------------------------------|---------------------------------------------------------------|-------------------------------------------------------------------------------|
| `POSTGRES_CONNECTION_STRING`                | `postgresql+psycopg2://myuser:mypassword@localhost:5432/test` | string for postgres connection                                                |
| `PASSWORD_RESET_FROM_MAIL_LINK_TEMPLATE`    | `http://127.0.0.1:8000/users/reset_password/$code`            | link template for password reset email callback. Must contain `$code` string. |
| `USER_VERIFICATION_FROM_MAIL_LINK_TEMPLATE` | `http://127.0.0.1:8000/users/verify-email/$code`              | link template for email confirmation. Must contain `$code` string             |
| `DEBUG`                                     | `0`                                                           | Debug mode for FastAPI                                                        |
| `OPENAPI_OUTPUT_PATH`                       | `user_service/docs/openapi.yaml`                              | Path to write generated openapi file                                          |
| `VALIDATION_CODES_LIFETIME_MINUTES`         | `30`                                                          | Lifetime for password reset and validation codes. Float values are accepted   |
| `MAIL_USERNAME`                             | `example`[*](#email-notice)                                   | Username for SMTP authentication                                              |
| `MAIL_PASSWORD`                             | `example`[*](#email-notice)                                   | Password for SMTP authentication                                              |
| `MAIL_PORT`                                 | `587`                                                         | SMTP Mail server port                                                         |
| `MAIL_SERVER`                               | `smtp.gmail.com`[*](#email-notice)                            | SMTP Mail server                                                              |
| `MAIL_STARTTLS`                             | `1`                                                           | For STARTTLS connections                                                      |
| `MAIL_SSL_TLS`                              | `1`                                                           | For connecting over TLS/SSL                                                   |
| `MAIL_DEBUG`                                | `0`                                                           | Debug mode for while sending mails                                            |
| `MAIL_FROM`                                 | `no-reply@example.com`                                        | Sender address                                                                |
| `MAIL_FROM_NAME`                            | `no-reply`                                                    | Title for Mail                                                                |
| `TEMPLATE_FOLDER`                           | Actual `templates` folder inside project                      | jinja2 template folder name                                                   |
| `ADMIN_USRNAME_HASH`                        | -                                                             | hash of admin`s username for auth                                             |
| `ADMIN_PASSWORD_HASH`                       | -                                                             | hash of admin`s password for auth                                             |
| `ADMIN_SECRET_KEY`                          | -                                                             | secret key to issue admin tokens      

> More info and option for email sending can be found here: https://sabuhish.github.io/fastapi-mail/getting-started/

### Required Environment variables:

- `POSTGRES_CONNECTION_STRING`
- `PASSWORD_RESET_FROM_MAIL_LINK_TEMPLATE`
- `USER_VERIFICATION_FROM_MAIL_LINK_TEMPLATE`
- `MAIL_SERVER`
- `MAIL_PORT`
- `MAIL_USERNAME`
- `MAIL_PASSWORD`
- `MAIL_STARTTLS`
- `MAIL_SSL_TLS`

## <a id="email-notice">CAUTION! Email credentials</a>

### **Do not use your email credentials - it does not work!**

Almost every email service provide SMTP server.
But it needs some configuration for sending emails via this app.

For example google requires app password setup [here](https://myaccount.google.com/apppasswords).
So config will be:
- `MAIL_PASSWORD` - password from app password setup
- `MAIL_USERNAME` - your email account with @
- `MAIL_PORT` - 587
- `MAIL_SERVER` - "smtp.gmail.com"
- `MAIL_STARTTLS` - 1
- `MAIL_SSL_TLS` - 0

### Check your email provider for info on how to use their SMTP!

## Installation and launch

### Python launch

1. Clone repo with ether:
    - `git clone https://gitlab.com/fanfarecorp/backend/user-service.git`
    - `git@gitlab.com:fanfarecorp/backend/user-service.git`

2. Install requirements:
    - `pip install -r requirements.txt`

3. Run project
    - `fastapi dev user_service/app.py`

### Docker launch

> Untested
