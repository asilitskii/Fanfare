FROM python:3.12-slim

WORKDIR /app

COPY . /app

RUN pip install poetry

RUN poetry config virtualenvs.create false \
    && poetry install --no-dev --no-interaction --no-ansi

EXPOSE 8000

CMD ["uvicorn", "auth_service.app:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "error"]
