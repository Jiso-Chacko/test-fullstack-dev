# Nricher API - Full-Stack Developer Test

A NestJS REST API for project and analysis management with role-based access control.

## Features

- **Role-based Access Control**: Super Admin, Admin, and User roles with specific permissions
- **Project Management**: CRUD operations for projects with ownership and sharing
- **Analysis Management**: CRUD operations for analyses within projects
- **Header-based Authentication**: Simplified authentication via x-user-id or x-user-email
- **Input Validation**: Request validation using class-validator
- **Error Handling**: Comprehensive error handling with logging
- **API Documentation**: Interactive
- **Database**: SQLite with prisma ORM

## Quick Start
### 1. Installation
```bash
# Clone the repository
git clone <repository-url>
cd nricher-api-test

# Install dependencies
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create database and apply schema
npx prisma db push

# Seed with test data
npm run db:seed

# Reset database
npm run db:reset

# View database
npx prisma studio
```

### 3. Start Application
```bash
# Development mode
npm run start:dev

# Production mode  
npm run start:prod
```

### 4. API Documentation

[Documentation](http://localhost:3000/api-docs)

## Database Schema

### Models
- **User**: Stores user information and roles
- **Project**: Projects owned by users with sharing capabilities
- **Analysis**: Analyses belonging to projects
- **ProjectAccess**: Many-to-many relationship for project sharing

### Authentication
The API uses simplified header-based authentication. Include one of these headers:
- `x-user-id`: User ID (number)
- `x-user-email`: User email (string)

 **Test Users**

 | id | email | Role | Access                                        |
 |----|-------|------|-----------------------------------------------|
 | 1  | superadmin@test.com  |   SUPER_ADMIN   | Full access                                   |
 | 2  | admin1@test.com |  ADMIN    | Create, edit, view owned project and analysis |
 | 3  | admin2@test.com  |    ADMIN  | Create, edit, view owned project and analysis                                              |
| 4  |    user1@test.com   |  USER    | Explicit Access                               |
| 5  |    user2@test.com   |   USER   | Explicit Access                               |

### Access Control Rules
**Super Admin**

- Create projects and analyses
- Access all projects and analyses
- Modify any resource

**Admin**

- Create projects
- Create analyses only in owned projects
- Access own projects and granted projects
- Modify own resources

**User**
- Read-only access to granted projects and analyses
- Cannot create projects or analyses

## API Endpoints
### Projects

  | Http Method | Endpoint  | Description          |
  |-------------|-----------|----------------------|
  | GET         | /projects | List all projects    |
  | GET    | /projects/:id        | Get single project   |
  | POST       | /projects     | Create a new project |
|    PATCH        |    /projects/:id        | Update project       |
|       DELETE          |    /projects/:id          | Remove a project     |


### Analyses

| Http Method | Endpoint  | Description           |
  |-------------|-----------|-----------------------|
| GET         | /projects/:projectId/analyses | List all analysis     |
| GET    | /projects/:projectId/analyses/:id         | Get single analysis   |
| POST       |  /projects/:projectId/analyses     | Create a new analysis |
|    PATCH        |    /projects/:projectId/analyses/:id         | Update analysis       |
|       DELETE          |    /projects/:projectId/analyses/:id       | Remove a analysis     |


## Testing

**Run Test**
```bash
npm test
```

## Logging
Application logs are written to:
- `logs/error.log` - Error logs only

## Technical Choices
### Architecture

- Modular Structure: Separate modules for projects, analyses and auth
- Global Services: Logger and Prisma available globally
- Guard-based Security: Authentication and authorization using NestJS guards

### Database

- SQLite: Simple setup for development/testing
- Prisma ORM: Provides convenient and safe access to database with migrations 
- Seeded Data: Sample data is provide to address cold start

### Error Handling

- Global Exception Filter: Used for consistent error response
- Http Status codes: Proper HTTP status codes for different error types

## Project Structure
```markdown
src/
├── analyses/           # Analysis management service
├── auth/              # Authentication services  
├── common/            # Shared utilities
│   ├── decorators/    # Custom decorators
│   ├── exceptions/       # Exception handler
│   ├── guards/        # Authentication guards
│   └── logger/        # Logging handler
├── projects/          # Project management service
├── prisma/           # Database service
└── main.ts           # Application entry point

prisma/
├── schema.prisma     # Database schema
└── seed.ts          # Test data

test/                 # E2E tests
logs/                # Application logs
```

