## Deployment Strategy

- We will deploy this app to AWS amplify as a Next.js full stack app, hence we want to maximize the usage of features native to this platform to reduce custom implementations that would probably require more time

## API Design Principles

### Error Code System
- **Backend APIs return error/status codes instead of human-readable messages**
- **Frontend is responsible for translating codes to appropriate language messages**
- This ensures:
  - Language-agnostic backend APIs
  - Consistent error handling across different clients
  - Easy localization support
  - Better separation of concerns

### Error Code Format
- Use descriptive, consistent error codes like: `VALIDATION_EMAIL_INVALID`, `USER_ALREADY_EXISTS`, `PASSWORD_TOO_WEAK`
- Success responses include success codes like: `REGISTRATION_SUCCESS`, `LOGIN_SUCCESS`
- Frontend maintains translation maps for each error/success code
- The app will always run on 3000, you should never change code when we get a message of conflicting port, instead we find ways to free the correct port and then proceed