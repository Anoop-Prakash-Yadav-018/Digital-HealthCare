# API Guide

## Authentication

### `POST /api/auth/register`
Creates a new patient account and linked patient profile.

Request body:

```json
{
  "name": "Amrita Sharma",
  "email": "amrita@example.com",
  "password": "Amrita@123",
  "patientProfile": {
    "name": "Amrita Sharma",
    "age": 29,
    "gender": "Female",
    "city": "Delhi"
  }
}
```

### `POST /api/auth/login`
Returns a JWT for `patient`, `doctor`, or `admin` users.

### `GET /api/auth/me`
Returns the authenticated user profile.

## Bootstrap

### `GET /api/bootstrap?patientId=<id>`
Returns the authenticated user context, visible patients, selected patient details, records, audits, medicines, forecast, and dashboard.

## Patients

### `GET /api/patient`
Returns patients visible to the current user.

### `POST /api/patient`
Allowed roles: `admin`, `doctor`

### `PUT /api/patient/:patientId`
Allowed roles: `admin`, `doctor`, or the owning patient user.

### `DELETE /api/patient/:patientId`
Allowed roles: `admin`, `doctor`

### `POST /api/patient/:patientId/health-id`
Generates or returns the patient health ID.

## Records

### `POST /api/records`
Creates a record for `patientId`.

### `PUT /api/records/:recordId`
Updates a record that the user is authorized to access.

### `DELETE /api/records/:recordId`
Deletes an accessible record.

## Forecast

### `POST /api/forecast/simulate`
Allowed roles: `admin`, `doctor`

Optional request body:

```json
{
  "doctors": 11
}
```

## Medicines

### `GET /api/medicines`
Authenticated users can view the medicine catalogue.

### `POST /api/medicines`
### `PUT /api/medicines/:medicineId`
### `DELETE /api/medicines/:medicineId`
Allowed role: `admin`
