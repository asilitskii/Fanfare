# API Gateway 

## Overview 

This API Gateway serves as a centralized entry point for client requests to various backend services. It routes requests to user and authentication services, handles authentication validation, and manages response statuses. Built with Nginx, this gateway is designed to enhance security and manage requests efficiently.

## Features 
 
- **Routing** : Directs requests to appropriate backend service
 
- **Authentication** : Validates user authentication through the `auth-service` before processing requests to other
 
- **Error Handling** : Returns appropriate HTTP status codes for unauthorized access.
 
- **Proxy Support** : Manages requests to backend services seamlessly.

## Prerequisites 
 
- **Docker** : Ensure Docker is installed on your machine to run the Nginx container.
 
- **Docker Compose** : Install Docker Compose for easy management of multi-container applications.

## Installation 
 
1. **Clone the Repository** :

```bash
git clone <repository-url>
cd api-gateway
```
 
2. **Build and Run the Application** :
Using Docker Compose:

```bash
docker-compose up --build
```
 
3. **Access the API Gateway** :
The API Gateway will be accessible at `http://localhost:8080`.

## Usage 

### Authentication Request 

To validate a user's authentication before accessing user services, the API Gateway performs an authentication request as follows:
 
- **Endpoint** : `/auth/validate`
 
- **Method** : `POST`
 
- **Response** : If authentication is successful, the request is proxied to the user service. Otherwise, it returns a `401 Unauthorized` status.

### Accessing Services 
 
- **User Service** : 
  - Access via: `http://localhost:8080/users/
 
- **Authentication Service** : 
  - Access via: `http://localhost:8080/auth/