
# Key Account Management System (KAM)

The **Key Account Management (KAM)** system is a web-based platform designed to manage restaurants, contacts, and interactions. This system facilitates tracking key accounts, their stakeholders, and activities like calls or orders for streamlined business operations.

## Table of Contents
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)

---

## Features
1. **Restaurant Management**  
   - Create, read, update, and delete restaurant details.
   - Manage restaurant statuses: \`active\`, \`inactive\`, \`converted\`.

2. **Contact Management**  
   - Add and retrieve stakeholders (contacts) linked to restaurants.
   - Update and delete contact details.

3. **Interaction Management**  
   - Log and track interactions (e.g., \`calls\`, \`orders\`) with restaurants.
   - Retrieve interaction details by restaurant.

4. **Comprehensive API**  
   - RESTful APIs for restaurants, contacts, and interactions.

5. **Database Relationships**  
   - Sequelize ORM for defining models and managing relationships.

6. **Testing**  
   - Thorough unit tests for services.

---

## Project Structure
\`\`\`
KAM/
├── src/
│   ├── api/                   # API Layer
│   │   ├── routes/            # API route definitions
│   │   │   ├── restaurant.js
│   │   │   ├── contact.js
│   │   │   └── interaction.js
│   │   ├── controllers/       # API controllers for handling requests
│   │       ├── restaurant.js
│   │       ├── contact.js
│   │       └── interaction.js
│   ├── domain/                # Business logic and services
│   │   ├── services/          # Logic layer
│   │       ├── restaurant.js
│   │       ├── contact.js
│   │       └── interaction.js
│   ├── infra/                 # Infrastructure layer
│   │   ├── db/                # Database models and connection setup
│   │   │   ├── models/
│   │   │   │   ├── restaurant.js
│   │   │   │   ├── contact.js
│   │   │   │   └── interaction.js
│   │   │   ├── index.js       # Export Sequelize and models
│   ├── tests/                 # Unit tests
│       ├── services/
│           ├── restaurant.test.js
│           ├── contact.test.js
│           └── interaction.test.js
├── .env                       # Environment variables
├── package.json               # Node.js dependencies and scripts
├── README.md                  # Project documentation
└── server.js                  # Entry point
\`\`\`

---

## Technologies Used
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL, Sequelize ORM
- **Caching:** Redis
- **Testing:** Jest
- **Development Tools:** ESLint, Prettier, Nodemon, Sequelize CLI

---

## Getting Started
### Prerequisites
Ensure you have the following installed:
1. **Node.js** (v16 or later)
2. **PostgreSQL** (v13 or later)
3. **Redis**
4. **npm**

### Installation
1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/KAM.git
   cd KAM
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Set up the database:
   \`\`\`bash
   npm run db:sync
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

---

## Environment Variables
Create a \`.env\` file in the root directory with the following content:
\`\`\`
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=kam_user
DB_PASSWORD=123
DB_NAME=kam_management
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=super_secure_key
\`\`\`

---

## Database Schema
### Tables:
1. **Restaurants**
   - \`id\` (Primary Key)
   - \`name\` (String)
   - \`address\` (String)
   - \`status\` (Enum: \`active\`, \`inactive\`, \`converted\`)

2. **Contacts**
   - \`id\` (Primary Key)
   - \`name\` (String)
   - \`role\` (String)
   - \`phone\` (String)
   - \`email\` (String)
   - \`restaurant_id\` (Foreign Key)

3. **Interactions**
   - \`id\` (Primary Key)
   - \`type\` (Enum: \`call\`, \`order\`)
   - \`details\` (Text)
   - \`date\` (Timestamp)
   - \`restaurant_id\` (Foreign Key)

---

## API Endpoints
### Restaurant
| Method | Endpoint               | Description                     |
|--------|-------------------------|---------------------------------|
| POST   | \`/api/restaurants\`      | Create a new restaurant         |
| GET    | \`/api/restaurants\`      | Fetch all restaurants           |
| GET    | \`/api/restaurants/:id\`  | Fetch restaurant by ID          |
| PUT    | \`/api/restaurants/:id\`  | Update restaurant by ID         |
| DELETE | \`/api/restaurants/:id\`  | Delete restaurant by ID         |

### Contact
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | \`/api/contacts\`           | Create a new contact            |
| GET    | \`/api/contacts/:restaurant_id\` | Fetch all contacts by restaurant |
| PUT    | \`/api/contacts/:id\`       | Update contact by ID            |
| DELETE | \`/api/contacts/:id\`       | Delete contact by ID            |

### Interaction
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | \`/api/interactions\`       | Create a new interaction        |
| GET    | \`/api/interactions/:restaurant_id\` | Fetch all interactions by restaurant |

---

## Testing
1. Run all tests:
   \`\`\`bash
   npm test
   \`\`\`
2. Check test coverage for:
   - **Restaurant**
   - **Contact**
   - **Interaction**

---

## Future Enhancements
1. Implement role-based authentication.
2. Add pagination for large datasets.
3. Create dashboards for visualizing interactions.
4. Deploy on a cloud platform (e.g., AWS, Heroku).
5. Add email notifications for scheduled interactions.

---

## Author
Developed by **Akshat Maithani**.

Feel free to reach out for any queries or suggestions!
`;

// Write the content to README.md
fs.writeFileSync('README.md', content, 'utf8');

console.log('README.md has been generated successfully!');
