# ForgeOS API Documentation

## Overview

This document provides comprehensive documentation for the ForgeOS platform API. All APIs follow REST conventions with JSON responses and are designed to be secure, scalable, and maintainable.

## Authentication

All API endpoints require authentication using JWT tokens. To authenticate:

1. Send a POST request to `/auth/login` with credentials
2. Receive a JWT token in response
3. Include the token in the Authorization header for subsequent requests:
   ```
   Authorization: Bearer <jwt-token>
   ```

### Refresh Tokens

When a JWT token expires, use the refresh endpoint to obtain a new one:
```
POST /auth/refresh
Content-Type: application/json
{
  "refreshToken": "<refresh-token>"
}
```

## API Endpoints

### Authentication Endpoints

#### POST /auth/login
Authenticate user and return access/refresh tokens

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string"
  }
}
```

#### POST /auth/register
Register a new user

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

#### POST /auth/refresh
Refresh access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

### Organization Endpoints

#### GET /organizations
List all organizations for the authenticated user

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
]
```

#### POST /organizations
Create a new organization

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

#### GET /organizations/{id}
Get organization details

#### PUT /organizations/{id}
Update organization details

**Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```

#### DELETE /organizations/{id}
Delete an organization

### RBAC Endpoints

#### GET /rbac/roles
List all roles

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "permissions": ["string"]
  }
]
```

#### POST /rbac/roles
Create a new role

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "permissions": ["string"]
}
```

#### GET /rbac/roles/{id}
Get role details

#### PUT /rbac/roles/{id}
Update role details

#### DELETE /rbac/roles/{id}
Delete a role

### Permissions Endpoints

#### GET /permissions
List all permissions

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "resource": "string"
  }
]
```

### Notifications Endpoints

#### GET /notifications
List user notifications

**Query Parameters:**
- `limit` (integer): Number of notifications to return
- `offset` (integer): Offset for pagination
- `read` (boolean): Filter by read/unread status

**Response:**
```json
{
  "notifications": [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "type": "string",
      "read": "boolean",
      "createdAt": "datetime"
    }
  ],
  "total": "integer"
}
```

#### POST /notifications
Send a notification

**Request Body:**
```json
{
  "title": "string",
  "message": "string",
  "type": "string",
  "recipientIds": ["string"],
  "priority": "string"
}
```

### Billing Endpoints

#### GET /billing/subscriptions
List user subscriptions

**Response:**
```json
[
  {
    "id": "string",
    "planName": "string",
    "status": "string",
    "startDate": "datetime",
    "endDate": "datetime",
    "amount": "number"
  }
]
```

#### POST /billing/subscribe
Subscribe to a plan

**Request Body:**
```json
{
  "planId": "string",
  "paymentMethodId": "string"
}
```

### Analytics Endpoints

#### GET /analytics/users
Get user analytics data

**Query Parameters:**
- `startDate` (datetime): Start date for analytics
- `endDate` (datetime): End date for analytics

**Response:**
```json
{
  "totalUsers": "integer",
  "newUsers": "integer",
  "activeUsers": "integer",
  "userGrowth": "number"
}
```

### Audit Logs Endpoints

#### GET /audit-logs
List audit logs

**Query Parameters:**
- `resource` (string): Filter by resource type
- `action` (string): Filter by action type
- `userId` (string): Filter by user ID
- `startDate` (datetime): Start date for filtering
- `endDate` (datetime): End date for filtering

**Response:**
```json
[
  {
    "id": "string",
    "userId": "string",
    "resource": "string",
    "action": "string",
    "details": "object",
    "timestamp": "datetime"
  }
]
```

### Scheduler Endpoints

#### GET /scheduler/tasks
List scheduled tasks

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "schedule": "string",
    "status": "string",
    "nextRun": "datetime"
  }
]
```

### Storage Endpoints

#### POST /storage/upload
Upload a file

**Request Body:** (multipart/form-data)
- `file`: File to upload
- `folder`: Optional folder path

#### GET /storage/files
List files in storage

**Query Parameters:**
- `folder` (string): Folder path to list
- `limit` (integer): Number of files to return
- `offset` (integer): Offset for pagination

## Error Handling

All API endpoints return appropriate HTTP status codes and error messages:

### Common HTTP Status Codes
- `200 OK` - Successful GET, PUT, PATCH requests
- `201 Created` - Successful POST requests
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Default limit: 1000 requests per hour per IP
- Exceeding limits results in 429 Too Many Requests status code
- Headers include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`

## Versioning

API versioning is implemented through the URL:
```
https://api.forgeos.com/v1/
```

All endpoints are prefixed with `/v1/` in the current version.

## Security Considerations

- All API communications must use HTTPS
- Input validation and sanitization for all parameters
- Role-based access control for protected endpoints
- JWT token rotation and refresh mechanisms
- Rate limiting to prevent abuse
- Comprehensive audit logging for all actions

This documentation will be updated as new endpoints are added or existing ones modified.