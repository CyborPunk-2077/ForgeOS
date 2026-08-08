# ForgeOS Platform

ForgeOS is a comprehensive platform for building and managing enterprise applications with robust authentication, authorization, and resource management capabilities.

## Features

- User Management
- Organization Management
- Role-Based Access Control (RBAC)
- Authentication & Authorization
- Database Integration with Prisma ORM

## Project Structure

```
forgeos-platform/
├── src/
│   ├── app.module.ts          # Main application module
│   ├── main.ts                # Entry point
│   ├── auth/                  # Authentication module
│   ├── users/                 # Users module
│   ├── organizations/         # Organizations module
│   ├── rbac/                  # RBAC module
│   ├── health/                # Health check module
│   └── database/              # Database module
├── test/                      # Test directory
│   ├── users/
│   ├── auth/
│   ├── organizations/
│   ├── rbac/
│   ├── health/
│   ├── e2e/                   # End-to-end tests
│   └── setup.ts               # Test setup
└── docs/                      # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Docker (for development environment)
- PostgreSQL database (or use Docker container)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forgeos-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

4. Run database migrations:
```bash
npx prisma migrate dev --name init
```

5. Start the development server:
```bash
npm run start:dev
```

## Testing

The project includes both unit and end-to-end tests.

### Running Tests

- Unit tests: `npm test`
- Unit tests in watch mode: `npm run test:watch`
- Coverage: `npm run test:cov`
- E2E tests: `npm run test:e2e`
- E2E tests in watch mode: `npm run test:e2e:watch`

### Test Structure

- Unit tests are located in `test/<module>/<module>.service.spec.ts` and `test/<module>/<module>.controller.spec.ts`
- E2E tests are located in `test/e2e/`

## API Documentation

API documentation is available at `/api` when the application is running.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.