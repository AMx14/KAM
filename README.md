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

### Production
To build and start the application in production mode:
```bash
npm run build
npm start
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
API endpoints are defined in `openapi.yaml`. Use tools like Swagger UI or Postman to explore and test the API.

## Sample Usage Examples
1. **Add a Restaurant Lead:**
   ```bash
   curl -X POST -H "Content-Type: application/json" -d '{"name": "Restaurant Name", "location": "City"}' http://localhost:3000/api/restaurant
   ```
2. **Get Leads Requiring Calls:**
   ```bash
   curl -X GET http://localhost:3000/api/calls/today
   ```

## Deployment
### CI/CD Pipeline
The repository includes a CI/CD pipeline defined in `.github/workflows/ci.yml`. It automates testing and deployment steps.

### Environment Configuration
Refer to `.env.example` for required environment variables. Ensure secure handling of secrets in production.

### Online Accessibility
Deploy using services like AWS, Heroku, or any cloud hosting platform. Include the `Dockerfile` and `docker-compose.yml` for containerized deployment.

## Demonstration
Record a 5-10 minute video showing:
1. Setting up the environment.
2. Running the application.
3. Demonstrating major features such as lead management, interaction tracking, and performance monitoring.

Provide the video link in this section.

## License
This project is licensed under the [MIT License](LICENSE).
