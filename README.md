# ForgeOS - Enterprise Engineering Platform

ForgeOS is the internal engineering platform that will power every SaaS product we ever build. It's designed to become the foundation for scalable, maintainable, and enterprise-grade software solutions.

## Vision

Create an engineering platform that allows our startup to build future SaaS products significantly faster while maintaining enterprise-grade quality.

## Core Products Powered by ForgeOS

- AI RevenueOS
- ReceptionFlow
- Visionance
- AI Recruitment
- AI Sales
- AI Support
- Future enterprise solutions

## Architecture

ForgeOS follows a modular monolith architecture with clean architecture principles and domain-driven design. It's designed to evolve into microservices as needed while maintaining enterprise-grade quality, security, and scalability.

## Technology Stack

- **Backend**: TypeScript, Node.js, NestJS
- **Database**: PostgreSQL, Redis
- **Infrastructure**: Docker, Docker Compose
- **ORM**: Prisma
- **API**: REST API with WebSocket support
- **Testing**: Jest
- **Documentation**: Mermaid for architecture diagrams

## Core Modules

1. Authentication
2. Organizations
3. RBAC
4. Permissions
5. API Keys
6. AI Framework
7. Workflow Engine
8. Notifications
9. Billing
10. Analytics
11. Audit Logs
12. Plugin System
13. Knowledge Base
14. Storage
15. Scheduler
16. Background Jobs
17. Integrations
18. Logging
19. Monitoring
20. Developer CLI
21. Security

## Quality Requirements

- Never generate toy code
- Never generate placeholder implementations
- Never skip error handling
- Never skip validation
- Never duplicate logic
- Every module must be independently testable
- Every module must include documentation
- Every public API must be documented
- Generate unit tests
- Generate integration tests
- Generate docker configuration
- Generate CI/CD
- Generate migrations
- Generate seed data
- Generate architecture diagrams using Mermaid

## Documentation

Maintain:

- docs/
  - architecture.md
  - roadmap.md
  - api.md
  - coding-standards.md

Every architectural decision must be documented.

## Implementation Rules

- Work on ONE milestone at a time
- Complete it fully
- Ensure all tests pass
- Update documentation
- Commit-ready code only
- Never redesign completed modules without a compelling architectural reason
- Always prioritize maintainability over speed