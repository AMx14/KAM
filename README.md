# KAM Lead Management System

## Project Overview
The Key Account Manager (KAM) Lead Management System is designed to streamline the management of restaurant accounts for Udaan, a B2B e-commerce platform. This system allows Key Account Managers to manage leads, track interactions, and monitor account performance efficiently.

## System Requirements
### Prerequisites
- Node.js (v16.x or above)
- Docker (optional, for containerized deployment)
- npm or yarn for package management

### Installation Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd KAM
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with the required values.

4. Run database migrations:
   ```bash
   npm run migrate
   ```

5. (Optional) Seed the database:
   ```bash
   npm run seed
   ```

## Running the Application
### Development
To start the application in development mode:
```bash
npm run dev
```

### Docker
To run the application using Docker:
1. Build the Docker image:
   ```bash
   docker-compose build
   ```
2. Start the services:
   ```bash
   docker-compose up
   ```

## Testing
Run unit and integration tests:
```bash
npm test
```

Run specific test files:
```bash
npm test -- tests/services/auth.test.js
```

## Project Structure
```
.
├── .DS_Store
├── .dockerignore
├── .env
├── .env.example
├── .env.test
├── .eslintrc.js
├── .github
│   └── workflows
│       └── ci.yml
├── .gitignore
├── .idea
│   ├── .gitignore
│   ├── KAM.iml
│   ├── material_theme_project_new.xml
│   ├── modules.xml
│   ├── vcs.xml
│   └── workspace.xml
├── .sequelizerc
├── Dockerfile
├── KAM Document.docx
├── README.md
├── curl
├── docker-compose.yml
├── eslint.config.mjs
├── generate-hash.js
├── healthcheck.js
├── jest.config.js
├── jest.setup.js
├── logs
│   └── server.log
├── openapi.yaml
├── package-lock.json
├── package.json
├── scripts
│   └── start-dev.sh
├── server.js
└── src
    ├── .DS_Store
    ├── api
    │   ├── controllers
    │   ├── index.js
    │   └── routes
    │       ├── address.js
    │       ├── auth.js
    │       ├── contact.js
    │       ├── health.js
    │       ├── interaction.js
    │       └── restaurant.js
    ├── core
    │   ├── config.js
    │   ├── errors
    │   │   └── customErrors.js
    │   ├── logger.js
    │   ├── middlewares
    │   │   ├── authMiddleware.js
    │   │   ├── errorHandler.js
    │   │   ├── errorMiddleware.js
    │   │   ├── rateLimiter.js
    │   │   ├── roleMiddleware.js
    │   │   └── sanitizer.js
    │   └── middlewares.js
    ├── domain
    │   ├── models
    │   │   └── index.js
    │   ├── repositories
    │   └── services
    │       ├── address.js
    │       ├── auth.js
    │       ├── contact.js
    │       ├── interaction.js
    │       └── restaurant.js
    ├── infra
    │   ├── cache
    │   └── db
    │       ├── config
    │       │   └── config.js
    │       ├── index.js
    │       ├── migrations
    │       │   └── 20250103144929-create-addresses.js
    │       ├── models
    │       │   ├── address.js
    │       │   ├── contact.js
    │       │   ├── index.js
    │       │   ├── interaction.js
    │       │   ├── restaurant.js
    │       │   └── user.js
    │       └── seeders
    ├── test-db.js
    ├── tests
    │   ├── integration
    │   ├── services
    │   │   ├── auth.test.js
    │   │   ├── contact.test.js
    │   │   ├── interaction.test.js
    │   │   └── restaurant.test.js
    │   └── unit
    └── utils
        ├── googleMaps.js
        └── timezone.js
```
## API Documentation
### Swagger Documentation
Access the Swagger UI for comprehensive API documentation at:
```
http://localhost:3000/api-docs
```

### Authentication Endpoints
1. **Register a User:**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"username": "example", "password": "password"}' http://localhost:3000/api/auth/register
   ```

2. **Login User:**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"username": "example", "password": "password"}' http://localhost:3000/api/auth/login
   ```

3. **Get User Profile:**
   ```bash
   curl -X GET -H "Authorization: Bearer <token>" http://localhost:3000/api/auth/profile
   ```

### Address Endpoints
1. **Create Address:**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"street": "123 Main St", "city": "Metropolis", "country": "Fictionland"}' http://localhost:3000/api/address
   ```

2. **Get All Addresses:**
   ```bash
   curl -X GET http://localhost:3000/api/address
   ```

3. **Get Address by ID:**
   ```bash
   curl -X GET http://localhost:3000/api/address/1
   ```

4. **Update Address by ID:**
   ```bash
   curl -X PUT -H "Content-Type: application/json" -d '{"street": "456 Elm St"}' http://localhost:3000/api/address/1
   ```

5. **Delete Address by ID:**
   ```bash
   curl -X DELETE http://localhost:3000/api/address/1
   ```

### Contact Endpoints
1. **Create Contact:**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com", "role": "Manager"}' http://localhost:3000/api/contact
   ```

2. **Get All Contacts:**
   ```bash
   curl -X GET http://localhost:3000/api/contact
   ```

### Restaurant Endpoints
1. **Add Restaurant:**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"name": "Food Place", "status": "active"}' http://localhost:3000/api/restaurant
   ```

2. **Get Restaurants:**
   ```bash
   curl -X GET http://localhost:3000/api/restaurant
   ```

3. **Get Leads Due for Call:**
   ```bash
   curl -X GET http://localhost:3000/api/restaurant/due-calls
   ```

4. **Get Performance Metrics:**
   ```bash
   curl -X GET http://localhost:3000/api/restaurant/performance-metrics
   ```

## Deployment
Refer to the Docker section above for running the application in a containerized environment.


Provide the video link in this section.

## License
This project is licensed under the [MIT License](LICENSE).
