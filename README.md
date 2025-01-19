# Blog App Backend

This is a **Node.js + Express.js** application written in **TypeScript** that demonstrates:

- A **CRUD API** for blog articles
- **Authentication** (user registration and login)
- **DynamoDB Local** integration
- **Redis** caching
- **Jest** unit tests
- A **multi-layered** architecture (controller, service, model) with best practices

---

## Table of Contents

- [Blog App Backend](#blog-app-backend)
    - [Table of Contents](#table-of-contents)
    - [Features](#features)
    - [Prerequisites](#prerequisites)
    - [Project Setup](#project-setup)
    - [TODO](#todo)
    - [Postman Collection](#postman-collection)

## Features

- **User Authentication**

    - Register new users with hashed passwords
    - Login returns a JWT
    - Middleware to restrict certain routes to logged-in users only

- **Article CRUD**

    - Create, read, update, and delete blog articles
    - Uses DynamoDB Local for data storage
    - Integrates with Redis for caching

- **Error Handling**

    - Custom `AppError` class for structured error messages and HTTP status codes
    - Logs errors using a custom logger

- **Testing**

    - Jest-based unit tests for `auth` and `article` services

- **Docker & Docker Compose**
    - Dockerfile for Node application
    - Compose services for local DynamoDB, Redis, and the Node backend

---

## Prerequisites

- **Node.js** (16.x or later recommended)
- **npm** or **yarn**
- **Docker** (for local development with containers)
- _(Optional)_ **AWS CLI** for interacting with DynamoDB Local

---

## Project Setup

1. **Clone** the repository:

    ```bash
    git clone https://github.com/your-username/blog-app-backend.git
    cd blog-app-backend
    ```

2. **Running with Docker**

    ```bash
    docker compose up -d
    ```

3. **Run Migration**

    ```bash
    npm run migrate
    ```

## TODO

- .env
- Run in multi thread of CPU.

## Postman Collection

- The postman collection for the API's are inside `postman` folder in root directory
