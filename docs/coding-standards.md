# ForgeOS Coding Standards

## Overview

This document outlines the coding standards and best practices for the ForgeOS platform. Adhering to these standards ensures code quality, maintainability, and consistency across all modules.

## Language & Framework

### TypeScript
- Use TypeScript 4.0+ with strict mode enabled
- Prefer interfaces over types where possible
- Use camelCase for variables and functions
- Use PascalCase for class names and enums
- All code must pass TypeScript compilation without errors

### NestJS
- Follow official NestJS documentation and patterns
- Use modules to organize code logically
- Implement dependency injection properly
- Use guards, interceptors, and pipes consistently
- Leverage built-in decorators and features

## Code Structure

### File Naming Convention
- Use kebab-case for file names: `user-service.ts`
- Use PascalCase for class names: `UserService`
- Use camelCase for functions and variables: `getUserById`

### Directory Structure
```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   └── user/
│       ├── user.controller.ts
│       ├── user.service.ts
│       ├── user.module.ts
│       └── dto/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   └── utilities/
└── core/
    ├── config/
    ├── database/
    └── exceptions/
```

### Module Organization
- Each module should have its own directory
- Keep related components together within modules
- Use clear, descriptive names for modules and files
- Follow the dependency inversion principle

## Code Quality

### Documentation
- All public APIs must be documented with JSDoc comments
- Include parameter descriptions and return types
- Document complex logic with inline comments
- Update documentation when making changes

### Error Handling
- Use custom exceptions where appropriate
- Handle errors gracefully without exposing internal details
- Log errors with sufficient context for debugging
- Implement proper error responses in API endpoints

### Validation
- Validate all inputs at the boundaries
- Use DTOs (Data Transfer Objects) for request validation
- Implement validation pipes in NestJS
- Include meaningful error messages for validation failures

### Testing
- Write unit tests for all business logic
- Write integration tests for complex flows
- Aim for 80%+ code coverage
- Use mocks and stubs appropriately
- Test edge cases and error conditions

## Security Best Practices

### Authentication & Authorization
- Use JWT tokens with secure configuration
- Implement refresh token rotation
- Validate all user inputs
- Use HTTPS exclusively
- Implement proper session management

### Data Protection
- Never log sensitive information
- Hash passwords using bcrypt or similar
- Encrypt sensitive data at rest
- Use parameterized queries to prevent SQL injection
- Implement CORS policies appropriately

### Input Sanitization
- Sanitize all user inputs
- Validate input types and ranges
- Implement rate limiting for API endpoints
- Use Content Security Policy headers

## Performance Guidelines

### Database Access
- Use Prisma ORM consistently
- Implement proper indexing strategies
- Avoid N+1 query problems
- Use transactions where necessary
- Optimize queries with appropriate selects

### Memory Management
- Avoid memory leaks in long-running processes
- Use connection pooling for database connections
- Implement caching appropriately
- Monitor for performance bottlenecks

## Code Review Process

### Pre-merge Requirements
- All code must pass linting and testing
- Code review by at least one other developer
- Documentation updates if applicable
- Performance considerations verified

### Review Checklist
- [ ] Does the code follow coding standards?
- [ ] Are all functions properly documented?
- [ ] Is error handling adequate?
- [ ] Are tests comprehensive?
- [ ] Does the implementation follow the architecture?
- [ ] Is there any potential security vulnerability?

## Git Workflow

### Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Use imperative mood
- Include issue reference if applicable (e.g., "Fix #123")

### Branching Strategy
- Use feature branches for new development
- Merge to main branch via pull requests
- Keep main branch stable at all times
- Use semantic versioning for releases

## Continuous Integration

### Automated Checks
- All commits must pass linting checks
- All tests must pass before merging
- Security scans should be run automatically
- Code coverage should be maintained or improved

### Deployment
- Automated deployment to staging environment
- Manual approval required for production deployment
- Rollback procedures should be documented
- Monitor deployments for issues

## Tools and Utilities

### Linting
- Use ESLint with TypeScript configuration
- Apply Prettier for code formatting
- Configure linting as pre-commit hook

### Testing
- Use Jest for unit and integration testing
- Implement proper test isolation
- Use test fixtures where appropriate
- Mock external dependencies effectively

### Documentation
- Generate API documentation automatically
- Keep documentation in sync with code changes
- Update architecture diagrams when significant changes occur

This document will be updated as the platform evolves and new best practices are established. All developers should familiarize themselves with these standards before beginning work on ForgeOS.