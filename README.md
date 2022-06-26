# auth-server

A central authentication server for all HergBot websites and services.

HTTP Status Codes:

- 200: Request succeeded
- 400: Request has invalid data
- 401: Authentication failed
- 403: Authorization failed
- 404: Requested resource has not been found

Starting Flow:

- Create HergBot Auth Service "Service" manually in database
- Use token generated in database to create user for HergBot Auth Service
- Manually update new user to 'Admin' role
- Admin user for HBAS can create new services
- Use token from new service to set up another service
- Other service uses token to create new users
- Other service uses token to create new sessions
- Users of other service can use session token to modify sessions

Service Routes:

- GET service
  - HBAS session token (HBAS admin role)
- GET /service/:serviceId
  - HBAS session token (HBAS admin role)
- POST service
  - HBAS session token (HBAS admin role)
- PATCH service/:serviceId
  - HBAS session token (HBAS admin role)
- DELETE service/:serviceId

  - HBAS session token (HBAS admin role)

  User Routes:

  - GET /user
    - Session token
    - Service Id?
    - hbas-admin-request header?
  - GET /user/:userId
    - Session token
    - Service Id?
    - hbas-admin-request header?
  - POST /user
    - Service token
    - Service Id
      OR
    - Session token
    - Service Id
    - hbas-admin-request header?
  - PATCH /user/:userId
    - Session token
    - Service Id
    - hbas-admin-request header?
  - DELETE /user/:userId
    - Session token
    - Service Id
    - hbas-admin-request header?

  Session Routes:

  - GET /session
    - HBAS session token (HBAS admin role)
  - POST /session
    - Service token
    - Service Id
  - PATCH /session
    - Session token
    - Service Id
    - hbas-admin-request header?
  - DELETE /session
    - Session token
    - Service Id
    - hbas-admin-request header?

### Common Errors

`Route.<method>() requires a callback function but got a [object Undefined]` when running tests
Fix: You probably forgot to mock a middleware

```
jest.mock("<middleware file>", () => ({
  middlewareMethodName: jest.fn((req, res, next) => {
    next();
  })
}));
```
