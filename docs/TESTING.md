# Testing

Run backend tests:

```bash
npm run test
```

The server test suite uses:

- `vitest`
- `supertest`
- `mongodb-memory-server`

It verifies:

- seeded admin login
- patient registration
- RBAC protection for medicine management
- admin medicine creation

Run the full project validation:

```bash
npm run check
```
