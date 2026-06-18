# Ershad-AI API Documentation

**Version:** 1.0  
**Base URL:** `https://api.ershad-ai.com` (or your configured base URL)  
**Date:** June 12, 2026

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Common Response Structure](#common-response-structure)
4. [Error Handling](#error-handling)
5. [API Endpoints by Controller](#api-endpoints-by-controller)
   - [Auth Controller](#auth-controller)
   - [Role Controller](#role-controller)
   - [Psychology Test Controller](#psychology-test-controller)
   - [Test Section Controller](#test-section-controller)
   - [Test Question Option Controller](#test-question-option-controller)
   - [User Test Session Controller](#user-test-session-controller)
   - [Scoring Rule Controller](#scoring-rule-controller)
   - [Generated Test Report Controller](#generated-test-report-controller)
   - [Appointment Controller](#appointment-controller)
   - [Consultant Education Controller](#consultant-education-controller)
   - [Consultant Experience Controller](#consultant-experience-controller)
   - [Admin Consultant Controller](#admin-consultant-controller)
   - [Articles Controller](#articles-controller)
   - [Lookup Controller](#lookup-controller)
   - [Notification Controller](#notification-controller)
   - [Subscription Controller](#subscription-controller)
   - [Settings Controller](#settings-controller)
   - [AI Chat Controller](#ai-chat-controller)
6. [Changes in Test Module](#changes-in-test-module)
7. [Entity Relationships](#entity-relationships)
8. [Enums Reference](#enums-reference)

---

## Overview

The Ershad-AI API provides access to psychological testing, consultation booking, AI-powered chat, and content management features. All endpoints return responses wrapped in a standardized `Result` object.

---

## Authentication

### Authentication Schemes

The API uses **JWT Bearer Token** authentication for protected endpoints.

### How to Authenticate

1. **Login:** Call `POST /api/Auth/login` with credentials
2. **Receive Token:** Extract the JWT token from the response
3. **Use Token:** Include in the `Authorization` header for subsequent requests:

```
Authorization: Bearer {your-jwt-token}
```

### Protected Endpoints

Endpoints marked with `[Authorize]` or `[Authorize(Roles = "...")]` require authentication.

---

## Common Response Structure

All API responses follow this structure:

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Operation completed successfully",
  "data": { ... },
  "error": null
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `succeeded` | boolean | Indicates if the operation was successful |
| `status` | string | Status code: `Success`, `Failed`, `Exist`, `NotExists` |
| `message` | string | Human-readable message |
| `data` | object | Response payload (varies by endpoint) |
| `error` | object | Error details (present when `succeeded` is false) |

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful operation |
| 400 | Bad Request | Validation failed, invalid input |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 502 | Bad Gateway | External service unavailable |

### Error Response Example

```json
{
  "succeeded": false,
  "status": "Failed",
  "message": "Validation failed",
  "data": {
    "Email": ["The Email field is required."]
  },
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "..."
  }
}
```

---

## API Endpoints by Controller

---

## Auth Controller

**Group:** auth  
**Base Route:** `/api/Auth`

### 1. Register Admin

**Endpoint:** `POST /api/Auth/RegisterAdmin`  
**Description:** Register a new admin user  
**Authentication:** Required (Admin role only)  
**Authorization:** `[Authorize(Roles = "Admin")]`

#### Request Body

```json
{
  "fullName": "Admin Name",
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | string | No | Admin's full name |
| `email` | string | Yes | Admin's email address |
| `password` | string | Yes | Admin's password |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Admin registered successfully",
  "data": {
    "token": "eyJhbGc...",
    "userId": "guid",
    "userName": "admin@example.com"
  },
  "error": null
}
```

#### Error Response (400 Bad Request)

```json
{
  "succeeded": false,
  "status": "Failed",
  "message": "Registration failed",
  "data": null,
  "error": {
    "message": "Email already exists"
  }
}
```

---

### 2. Register User

**Endpoint:** `POST /api/Auth/RegisterUser`  
**Description:** Register a new regular user  
**Authentication:** Not required

#### Request Body

```json
{
  "userName": "john_doe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "whatsAppNumber": "+1234567890",
  "nationalityId": 1,
  "age": 30,
  "identityNumber": "123456789",
  "gender": 1,
  "maritalStatus": 2,
  "marriageYears": "5",
  "childrenCount": "2"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userName` | string | Yes | Unique username |
| `fullName` | string | No | User's full name |
| `email` | string | Yes | User's email |
| `password` | string | Yes | User's password |
| `phoneNumber` | string | Yes | Phone number |
| `whatsAppNumber` | string | No | WhatsApp number |
| `nationalityId` | integer | No | Foreign key to Nationality |
| `age` | integer | Yes | User's age |
| `identityNumber` | string | Yes | Identity/National ID |
| `gender` | integer | Yes | Gender enum: 1=Male, 2=Female |
| `maritalStatus` | integer | Yes | Marital status enum |
| `marriageYears` | string | No | Years of marriage |
| `childrenCount` | string | No | Number of children |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGc...",
    "userId": "guid",
    "userName": "john_doe"
  },
  "error": null
}
```

---

### 3. Register Consultant

**Endpoint:** `POST /api/Auth/RegisterConsultant`  
**Description:** Register a new consultant  
**Authentication:** Not required

#### Request Body

```json
{
  "userName": "dr_consultant",
  "fullName": "Dr. Consultant",
  "email": "consultant@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "whatsAppNumber": "+1234567890",
  "nationalityId": 1,
  "identityNumber": "123456789",
  "gender": 1,
  "maritalStatus": 1,
  "qualification": "PhD in Psychology",
  "experienceYears": "10",
  "consultationsReceived": 500,
  "specializationIds": [1, 2, 3],
  "contactTimeIds": [1, 2]
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userName` | string | Yes | Unique username |
| `fullName` | string | No | Consultant's full name |
| `email` | string | Yes | Consultant's email |
| `password` | string | Yes | Consultant's password |
| `phoneNumber` | string | Yes | Phone number |
| `whatsAppNumber` | string | Yes | WhatsApp number |
| `nationalityId` | integer | Yes | Foreign key to Nationality |
| `identityNumber` | string | Yes | Identity/National ID |
| `gender` | integer | Yes | Gender enum |
| `maritalStatus` | integer | Yes | Marital status enum |
| `qualification` | string | Yes | Education qualification |
| `experienceYears` | string | Yes | Years of experience |
| `consultationsReceived` | integer | Yes | Total consultations provided |
| `specializationIds` | array[integer] | No | List of specialization IDs |
| `contactTimeIds` | array[integer] | No | Preferred contact time IDs |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Consultant registered successfully",
  "data": {
    "token": "eyJhbGc...",
    "userId": "guid",
    "userName": "dr_consultant"
  },
  "error": null
}
```

---

### 4. Login

**Endpoint:** `POST /api/Auth/login`  
**Description:** Authenticate user and receive JWT token  
**Authentication:** Not required

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email |
| `password` | string | Yes | User's password |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "user@example.com"
  },
  "error": null
}
```

#### Error Response (401 Unauthorized)

```json
{
  "succeeded": false,
  "status": "Failed",
  "message": "Invalid credentials",
  "data": null,
  "error": null
}
```

---

### 5. Get User By ID

**Endpoint:** `GET /api/Auth/GetUser/{userId}`  
**Description:** Retrieve user details by user ID  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (GUID) | Yes | User's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "phoneNumber": "+1234567890",
    "whatsAppNumber": "+1234567890",
    "age": 30,
    "nationalityId": 1,
    "maritalStatus": "Married",
    "marriageYears": "5",
    "childrenCount": "2",
    "createdDate": "2026-01-01T00:00:00Z"
  },
  "error": null
}
```

#### Error Response (404 Not Found)

```json
{
  "succeeded": false,
  "status": "NotExists",
  "message": "User not found",
  "data": null,
  "error": null
}
```

---

### 6. Get Consultant By ID

**Endpoint:** `GET /api/Auth/GetConsultant/{userId}`  
**Description:** Retrieve consultant details by user ID  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (GUID) | Yes | Consultant's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "userName": "dr_consultant",
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "createdDate": "2026-01-01T00:00:00Z",
    "fullName": "Dr. Consultant",
    "identityNumber": "123456789",
    "nationality": "Saudi Arabia",
    "gender": "Male",
    "maritalStatus": "Single",
    "phoneNumber": "+1234567890",
    "whatsAppNumber": "+1234567890",
    "email": "consultant@example.com",
    "qualification": "PhD in Psychology",
    "experienceYears": "10",
    "specialization": ["Marriage Counseling", "Child Psychology"],
    "identityFileUrl": "https://storage.example.com/identity.pdf",
    "qualificationFileUrl": "https://storage.example.com/qualification.pdf",
    "addressFileUrl": "https://storage.example.com/address.pdf",
    "personalFileUrl": "https://storage.example.com/personal.pdf",
    "userContactTimes": [
      {
        "start": "09:00",
        "end": "17:00"
      }
    ]
  },
  "error": null
}
```

---

### 7. Upload or Update User Files

**Endpoint:** `POST /api/Auth/UploadOrUpdateUserFilesAsync/{userId}`  
**Description:** Upload or update consultant documents (identity, qualification, etc.)  
**Authentication:** Not required  
**Content-Type:** `multipart/form-data`

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (GUID) | Yes | User's unique identifier |

#### Request Body (Form Data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `IdentityFile` | file | No | Identity document (PDF, image) |
| `QualificationFile` | file | No | Qualification certificate |
| `AddressFile` | file | No | Address proof document |
| `PersonalFile` | file | No | Personal/CV document |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Files uploaded successfully",
  "data": {
    "identityFileUrl": "https://storage.example.com/identity.pdf",
    "qualificationFileUrl": "https://storage.example.com/qualification.pdf",
    "addressFileUrl": "https://storage.example.com/address.pdf",
    "personalFileUrl": "https://storage.example.com/personal.pdf"
  },
  "error": null
}
```

---

### 8. Update Session Price

**Endpoint:** `PUT /api/Auth/UpdateSessionPrice/{userId}`  
**Description:** Update consultant's session price  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (GUID) | Yes | Consultant's unique identifier |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `newPrice` | integer | Yes | New session price |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Session price updated successfully",
  "data": null,
  "error": null
}
```

---

### 9. Check Username and Email

**Endpoint:** `GET /api/Auth/CheckUserNameAndEmail`  
**Description:** Check if username or email already exists  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userName` | string | No | Username to check |
| `email` | string | No | Email to check |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "userNameExists": true,
    "emailExists": false
  },
  "error": null
}
```

---

### 10. Update User Profile

**Endpoint:** `PUT /api/Auth/updateUserProfile`  
**Description:** Update user profile information  
**Authentication:** Not required

#### Request Body

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "age": 31,
  "maritalStatus": 2,
  "marriageYears": "6",
  "childrenCount": "2",
  "fullName": "John Updated Doe",
  "userName": "john_doe_updated"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | User's unique identifier |
| `age` | integer | Yes | User's age |
| `maritalStatus` | integer | Yes | Marital status enum |
| `marriageYears` | string | No | Years of marriage |
| `childrenCount` | string | No | Number of children |
| `fullName` | string | No | User's full name |
| `userName` | string | No | User's username |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Profile updated successfully",
  "data": {
    "token": "new_jwt_token...",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "userName": "john_doe_updated"
  },
  "error": null
}
```

---

### 11. Get All Users

**Endpoint:** `GET /api/Auth/all`  
**Description:** Retrieve all users (admins, users, consultants)  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": "guid",
      "userName": "user1",
      "email": "user1@example.com",
      "role": "User",
      "createdDate": "2026-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

---

### 12. Get All Users (Regular Users Only)

**Endpoint:** `GET /api/Auth/GetAllUsers`  
**Description:** Retrieve all regular users (excluding consultants and admins)  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": "guid",
      "userName": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "phoneNumber": "+1234567890",
      "whatsAppNumber": "+1234567890",
      "age": 30,
      "nationalityId": 1,
      "maritalStatus": "Married",
      "marriageYears": "5",
      "childrenCount": "2",
      "createdDate": "2026-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

---

### 13. Get All Consultants

**Endpoint:** `GET /api/Auth/GetAllConsultant`  
**Description:** Retrieve all consultants  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "userName": "dr_consultant",
      "id": "guid",
      "createdDate": "2026-01-01T00:00:00Z",
      "fullName": "Dr. Consultant",
      "identityNumber": "123456789",
      "nationality": "Saudi Arabia",
      "gender": "Male",
      "maritalStatus": "Single",
      "phoneNumber": "+1234567890",
      "whatsAppNumber": "+1234567890",
      "email": "consultant@example.com",
      "qualification": "PhD in Psychology",
      "experienceYears": "10",
      "specialization": ["Marriage Counseling"],
      "identityFileUrl": "https://...",
      "qualificationFileUrl": "https://...",
      "addressFileUrl": "https://...",
      "personalFileUrl": "https://...",
      "userContactTimes": []
    }
  ],
  "error": null
}
```

---

### 14. Get By ID

**Endpoint:** `GET /api/Auth/{id}`  
**Description:** Retrieve any user by ID (generic endpoint)  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string (GUID) | Yes | User's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": "guid",
    "userName": "user",
    "email": "user@example.com",
    "role": "User"
  },
  "error": null
}
```

#### Error Response (404 Not Found)

```json
{
  "succeeded": false,
  "status": "NotExists",
  "message": "User not found",
  "data": null,
  "error": null
}
```

---

### 15. Change Password

**Endpoint:** `POST /api/Auth/change-password`  
**Description:** Change user's password (requires authentication)  
**Authentication:** Required  
**Authorization:** `[Authorize]`

#### Request Body

```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `currentPassword` | string | Yes | User's current password |
| `newPassword` | string | Yes | New password |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Password changed successfully",
  "data": null,
  "error": null
}
```

#### Error Response (400 Bad Request)

```json
{
  "succeeded": false,
  "status": "Failed",
  "message": "Current password is incorrect",
  "data": null,
  "error": null
}
```

---

### 16. Forgot Password

**Endpoint:** `POST /api/Auth/forgot-password`  
**Description:** Request password reset OTP via email  
**Authentication:** Not required

#### Request Body

```json
"user@example.com"
```

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "OTP sent to your email",
  "data": null,
  "error": null
}
```

---

### 17. Reset Password

**Endpoint:** `POST /api/Auth/reset-password`  
**Description:** Reset password using OTP  
**Authentication:** Not required

#### Request Body

```json
{
  "email": "user@example.com",
  "otpCode": "123456",
  "newPassword": "NewPassword123!"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | User's email |
| `otpCode` | string | Yes | OTP code received via email |
| `newPassword` | string | Yes | New password |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Password reset successfully",
  "data": null,
  "error": null
}
```

#### Error Response (400 Bad Request)

```json
{
  "succeeded": false,
  "status": "Failed",
  "message": "Invalid or expired OTP",
  "data": null,
  "error": null
}
```

---

### 18. Check OTP

**Endpoint:** `POST /api/Auth/CheckOTP`  
**Description:** Verify OTP without resetting password  
**Authentication:** Not required

#### Request Body

```json
{
  "email": "user@example.com",
  "otpCode": "123456"
}
```

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "OTP is valid",
  "data": null,
  "error": null
}
```

---

### 19. Resend OTP

**Endpoint:** `POST /api/Auth/resend-otp`  
**Description:** Resend OTP to user's email  
**Authentication:** Not required

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "OTP resent successfully",
  "data": null,
  "error": null
}
```

---

### 20. Get Consultant Requirements

**Endpoint:** `GET /api/Auth/requirements/{consultantId}`  
**Description:** Get consultant's status and subscription requirements  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `consultantId` | string (GUID) | Yes | Consultant's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "consultantId": "guid",
    "isApproved": true,
    "hasActiveSubscription": true,
    "subscriptionEndDate": "2027-01-01T00:00:00Z"
  },
  "error": null
}
```

---

### 21. Get Consultant Appointments

**Endpoint:** `GET /api/Auth/consultant/{consultantId}/appointments`  
**Description:** Get all appointments for a specific consultant  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `consultantId` | string (GUID) | Yes | Consultant's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "appointmentId": 1,
      "userId": "guid",
      "date": "2026-06-15T00:00:00Z",
      "startTime": "10:00:00",
      "endTime": "11:00:00",
      "status": "Confirmed"
    }
  ],
  "error": null
}
```

---

### 22. Start Appointment Session

**Endpoint:** `GET /api/Auth/appointment/{appointmentId}/start`  
**Description:** Mark appointment as started  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appointmentId` | integer | Yes | Appointment ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Session started successfully",
  "data": null,
  "error": null
}
```

---

### 23. Get Consultant Revenue

**Endpoint:** `GET /api/Auth/consultant/{consultantId}/revenue`  
**Description:** Get consultant's revenue statistics  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `consultantId` | string (GUID) | Yes | Consultant's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "totalRevenue": 15000.00,
    "currentMonthRevenue": 2000.00,
    "completedSessions": 150
  },
  "error": null
}
```

---

### 24. Add Bank Account

**Endpoint:** `POST /api/Auth/BankAccount/Add`  
**Description:** Add bank accounts for consultant/user  
**Authentication:** Not required

#### Request Body

```json
{
  "userId": "guid",
  "accounts": [
    {
      "userId": "guid",
      "bankName": "National Bank",
      "accountHolderName": "John Doe",
      "iban": "SA1234567890123456789012",
      "accountNumber": "1234567890",
      "swiftCode": "NBOCSARI",
      "branchName": "Main Branch",
      "isDefault": true
    }
  ]
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | User's unique identifier |
| `accounts` | array | Yes | List of bank accounts |
| `accounts[].userId` | string | Yes | User's unique identifier |
| `accounts[].bankName` | string | No | Name of the bank |
| `accounts[].accountHolderName` | string | No | Account holder's name |
| `accounts[].iban` | string | No | International Bank Account Number |
| `accounts[].accountNumber` | string | No | Bank account number |
| `accounts[].swiftCode` | string | No | SWIFT/BIC code |
| `accounts[].branchName` | string | No | Branch name |
| `accounts[].isDefault` | boolean | Yes | Is this the default account |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Bank accounts added successfully",
  "data": [
    {
      "id": 1,
      "userId": "guid",
      "bankName": "National Bank",
      "accountHolderName": "John Doe",
      "iban": "SA1234567890123456789012",
      "accountNumber": "1234567890",
      "swiftCode": "NBOCSARI",
      "branchName": "Main Branch",
      "isDefault": true
    }
  ],
  "error": null
}
```

---

### 25. Update Bank Account

**Endpoint:** `PUT /api/Auth/BankAccount/Update`  
**Description:** Update existing bank account  
**Authentication:** Not required

#### Request Body

```json
{
  "id": 1,
  "userId": "guid",
  "bankName": "Updated Bank",
  "accountHolderName": "John Doe",
  "iban": "SA1234567890123456789012",
  "accountNumber": "1234567890",
  "swiftCode": "NBOCSARI",
  "branchName": "Updated Branch",
  "isDefault": true
}
```

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Bank account updated successfully",
  "data": {
    "id": 1,
    "userId": "guid",
    "bankName": "Updated Bank",
    "accountHolderName": "John Doe",
    "iban": "SA1234567890123456789012",
    "accountNumber": "1234567890",
    "swiftCode": "NBOCSARI",
    "branchName": "Updated Branch",
    "isDefault": true
  },
  "error": null
}
```

---

### 26. Get User Bank Accounts

**Endpoint:** `GET /api/Auth/BankAccount/GetAll/{userId}`  
**Description:** Get all bank accounts for a user  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (GUID) | Yes | User's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "userId": "guid",
      "bankName": "National Bank",
      "accountHolderName": "John Doe",
      "iban": "SA1234567890123456789012",
      "accountNumber": "1234567890",
      "swiftCode": "NBOCSARI",
      "branchName": "Main Branch",
      "isDefault": true
    }
  ],
  "error": null
}
```

---

### 27. Get Consultant Calendar

**Endpoint:** `GET /api/Auth/Consultant/{consultantId}/Calendar`  
**Description:** Get consultant's calendar with appointments  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `consultantId` | string (GUID) | Yes | Consultant's unique identifier |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `year` | integer | No | Year (defaults to current year) |
| `month` | integer | No | Month 1-12 (defaults to current month) |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "year": 2026,
    "month": 6,
    "appointments": [
      {
        "date": "2026-06-15",
        "startTime": "10:00",
        "endTime": "11:00",
        "status": "Confirmed"
      }
    ]
  },
  "error": null
}
```

---

## Role Controller

**Group:** auth  
**Base Route:** `/api/Role`

### 1. Create Role

**Endpoint:** `POST /api/Role/CreateRole`  
**Description:** Create a new role  
**Authentication:** Not required

#### Request Body

```json
{
  "roleName": "Manager"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roleName` | string | Yes | Name of the role |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Role created successfully",
  "data": {
    "roleId": "guid",
    "roleName": "Manager"
  },
  "error": null
}
```

---

### 2. Get All Roles

**Endpoint:** `GET /api/Role/GetRoles`  
**Description:** Retrieve all roles  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "roleId": "guid",
      "roleName": "Admin"
    },
    {
      "roleId": "guid",
      "roleName": "User"
    },
    {
      "roleId": "guid",
      "roleName": "Consultant"
    }
  ],
  "error": null
}
```

---

### 3. Get Role By ID

**Endpoint:** `GET /api/Role/GetByIdRoleAsync/{id}`  
**Description:** Retrieve role details by ID  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | GUID | Yes | Role's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "roleId": "guid",
    "roleName": "Admin"
  },
  "error": null
}
```

#### Error Response (404 Not Found)

```json
{
  "succeeded": false,
  "status": "NotExists",
  "message": "Role not found",
  "data": null,
  "error": null
}
```

---

### 4. Update Role

**Endpoint:** `PUT /api/Role/UpdateRole`  
**Description:** Update role name  
**Authentication:** Not required

#### Request Body

```json
{
  "roleId": "550e8400-e29b-41d4-a716-446655440000",
  "newRoleName": "Super Admin"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roleId` | GUID | Yes | Role's unique identifier |
| `newRoleName` | string | Yes | New role name |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Role updated successfully",
  "data": null,
  "error": null
}
```

---

### 5. Delete Role

**Endpoint:** `DELETE /api/Role/DeleteRole/{id}`  
**Description:** Delete a role  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | GUID | Yes | Role's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Role deleted successfully",
  "data": null,
  "error": null
}
```

---

## Psychology Test Controller

**Group:** Test  
**Base Route:** `/api/PsychologyTest`

### 1. Create Psychology Test

**Endpoint:** `POST /api/PsychologyTest/Create`  
**Description:** Create a new psychology test  
**Authentication:** Not required  
**Content-Type:** `multipart/form-data`

#### Request Body (Form Data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Title` | string | Yes | Test title |
| `URLImage` | file | No | Test cover image |
| `Description` | string | Yes | Test description |
| `IsFree` | boolean | Yes | Is the test free to take |
| `ReportRequiresPurchase` | boolean | Yes | Does the report require payment |
| `Price` | decimal | No | Test price (if not free) |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Psychology test created successfully",
  "data": {
    "id": 1,
    "title": "Personality Assessment",
    "urlImage": "https://storage.example.com/test-image.jpg",
    "description": "A comprehensive personality test",
    "isFree": false,
    "reportRequiresPurchase": true,
    "price": 29.99,
    "createdDate": "2026-06-12T00:00:00Z"
  },
  "error": null
}
```

#### Error Response (400 Bad Request)

```json
{
  "succeeded": false,
  "status": "Failed",
  "message": "Validation failed",
  "data": {
    "Title": ["The Title field is required."]
  },
  "error": null
}
```

---

### 2. Update Psychology Test

**Endpoint:** `PUT /api/PsychologyTest/Update`  
**Description:** Update an existing psychology test  
**Authentication:** Not required  
**Content-Type:** `multipart/form-data`

#### Request Body (Form Data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `Id` | integer | Yes | Test ID |
| `Title` | string | Yes | Test title |
| `URLImage` | file | No | Test cover image (optional) |
| `Description` | string | Yes | Test description |
| `IsFree` | boolean | Yes | Is the test free |
| `ReportRequiresPurchase` | boolean | Yes | Does report require payment |
| `Price` | decimal | No | Test price |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Psychology test updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Personality Assessment",
    "urlImage": "https://storage.example.com/updated-image.jpg",
    "description": "Updated description",
    "isFree": false,
    "reportRequiresPurchase": true,
    "price": 39.99,
    "createdDate": "2026-06-12T00:00:00Z"
  },
  "error": null
}
```

---

### 3. Delete Psychology Test

**Endpoint:** `DELETE /api/PsychologyTest/delete/{id}`  
**Description:** Delete a psychology test  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Test ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Psychology test deleted successfully",
  "data": null,
  "error": null
}
```

#### Error Response (404 Not Found)

```json
{
  "succeeded": false,
  "status": "NotExists",
  "message": "Psychology test not found",
  "data": null,
  "error": null
}
```

---

### 4. Get All Psychology Tests

**Endpoint:** `GET /api/PsychologyTest/GetAll`  
**Description:** Retrieve all psychology tests  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "title": "Personality Assessment",
      "urlImage": "https://storage.example.com/test-image.jpg",
      "description": "A comprehensive personality test",
      "isFree": false,
      "reportRequiresPurchase": true,
      "price": 29.99,
      "createdDate": "2026-06-12T00:00:00Z"
    },
    {
      "id": 2,
      "title": "Depression Screening",
      "urlImage": "https://storage.example.com/depression-test.jpg",
      "description": "Screen for depression symptoms",
      "isFree": true,
      "reportRequiresPurchase": false,
      "price": null,
      "createdDate": "2026-06-10T00:00:00Z"
    }
  ],
  "error": null
}
```

---

### 5. Get Psychology Test By ID

**Endpoint:** `GET /api/PsychologyTest/GetById`  
**Description:** Retrieve a specific psychology test  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Id` | integer | Yes | Test ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": 1,
    "title": "Personality Assessment",
    "urlImage": "https://storage.example.com/test-image.jpg",
    "description": "A comprehensive personality test",
    "isFree": false,
    "reportRequiresPurchase": true,
    "price": 29.99,
    "createdDate": "2026-06-12T00:00:00Z"
  },
  "error": null
}
```

---

## Test Section Controller

**Group:** Test  
**Base Route:** `/api/TestSection`

### 1. Create Test Section

**Endpoint:** `POST /api/TestSection/Create`  
**Description:** Create a new test section  
**Authentication:** Not required

#### Request Body

```json
{
  "title": "Personal Traits",
  "description": "Questions about your personal characteristics",
  "psychologyTestId": 1
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Section title |
| `description` | string | Yes | Section description |
| `psychologyTestId` | integer | Yes | Foreign key to PsychologyTest |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test section created successfully",
  "data": {
    "id": 1,
    "title": "Personal Traits",
    "description": "Questions about your personal characteristics",
    "psychologyTestId": 1
  },
  "error": null
}
```

#### Error Response (400 Bad Request)

```json
{
  "succeeded": false,
  "status": "Failed",
  "message": "Validation failed",
  "data": null,
  "error": null
}
```

---

### 2. Update Test Section

**Endpoint:** `PUT /api/TestSection/Update`  
**Description:** Update an existing test section  
**Authentication:** Not required

#### Request Body

```json
{
  "id": 1,
  "title": "Updated Personal Traits",
  "description": "Updated description of personal traits"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | Yes | Section ID |
| `title` | string | Yes | Updated section title |
| `description` | string | Yes | Updated section description |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test section updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Personal Traits",
    "description": "Updated description of personal traits",
    "psychologyTestId": 1
  },
  "error": null
}
```

---

### 3. Delete Test Section

**Endpoint:** `DELETE /api/TestSection/delete/{id}`  
**Description:** Delete a test section  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Section ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test section deleted successfully",
  "data": null,
  "error": null
}
```

#### Error Response (404 Not Found)

```json
{
  "succeeded": false,
  "status": "NotExists",
  "message": "Test section not found",
  "data": null,
  "error": null
}
```

---

### 4. Get All Test Sections for Test

**Endpoint:** `GET /api/TestSection/GetAllForTest`  
**Description:** Retrieve all sections for a specific test  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TestId` | integer | Yes | Psychology Test ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "title": "Personal Traits",
      "description": "Questions about your personal characteristics",
      "psychologyTestId": 1
    },
    {
      "id": 2,
      "title": "Social Behavior",
      "description": "Questions about your social interactions",
      "psychologyTestId": 1
    }
  ],
  "error": null
}
```

---

### 5. Get Test Section By ID

**Endpoint:** `GET /api/TestSection/GetById`  
**Description:** Retrieve a specific test section  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Id` | integer | Yes | Section ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": 1,
    "title": "Personal Traits",
    "description": "Questions about your personal characteristics",
    "psychologyTestId": 1
  },
  "error": null
}
```

---

## Test Question Option Controller

**Group:** Test  
**Base Route:** `/api/TestQuestionOption`

### 1. Create Test Question

**Endpoint:** `POST /api/TestQuestionOption/Create`  
**Description:** Create a new test question with options  
**Authentication:** Not required

#### Request Body

```json
{
  "questionText": "How often do you feel stressed?",
  "psychologyTestId": 1,
  "testSectionId": 1,
  "options": [
    {
      "optionText": "Never",
      "scoreValue": 1
    },
    {
      "optionText": "Rarely",
      "scoreValue": 2
    },
    {
      "optionText": "Sometimes",
      "scoreValue": 3
    },
    {
      "optionText": "Often",
      "scoreValue": 4
    },
    {
      "optionText": "Always",
      "scoreValue": 5
    }
  ]
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `questionText` | string | Yes | Question text |
| `psychologyTestId` | integer | Yes | Foreign key to PsychologyTest |
| `testSectionId` | integer | Yes | Foreign key to TestSection |
| `options` | array | Yes | List of answer options |
| `options[].optionText` | string | Yes | Option text |
| `options[].scoreValue` | integer | Yes | Score value for this option |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test question created successfully",
  "data": {
    "id": 1,
    "questionText": "How often do you feel stressed?",
    "testSectionId": 1,
    "testSectionTitle": "Personal Traits",
    "testSectionDescription": "Questions about your personal characteristics",
    "options": [
      {
        "id": 1,
        "optionText": "Never",
        "scoreValue": 1,
        "testQuestionId": 1
      },
      {
        "id": 2,
        "optionText": "Rarely",
        "scoreValue": 2,
        "testQuestionId": 1
      }
    ]
  },
  "error": null
}
```

---

### 2. Update Test Question

**Endpoint:** `PUT /api/TestQuestionOption/Update`  
**Description:** Update an existing test question  
**Authentication:** Not required

#### Request Body

```json
{
  "id": 1,
  "questionText": "How frequently do you feel stressed?",
  "testSectionId": 1,
  "options": [
    {
      "id": 1,
      "optionText": "Never",
      "scoreValue": 1,
      "testQuestionId": 1
    },
    {
      "id": 2,
      "optionText": "Rarely",
      "scoreValue": 2,
      "testQuestionId": 1
    }
  ]
}
```

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test question updated successfully",
  "data": {
    "id": 1,
    "questionText": "How frequently do you feel stressed?",
    "testSectionId": 1,
    "options": [...]
  },
  "error": null
}
```

---

### 3. Delete Test Question

**Endpoint:** `DELETE /api/TestQuestionOption/delete/{id}`  
**Description:** Delete a test question  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Question ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test question deleted successfully",
  "data": null,
  "error": null
}
```

---

### 4. Get All Test Questions (Detailed)

**Endpoint:** `GET /api/TestQuestionOption/GetAll`  
**Description:** Retrieve all questions for a test with full option details  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TestId` | integer | Yes | Psychology Test ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "questionText": "How often do you feel stressed?",
      "testSectionId": 1,
      "testSectionTitle": "Personal Traits",
      "testSectionDescription": "Questions about your personal characteristics",
      "options": [
        {
          "id": 1,
          "optionText": "Never",
          "scoreValue": 1,
          "testQuestionId": 1
        },
        {
          "id": 2,
          "optionText": "Rarely",
          "scoreValue": 2,
          "testQuestionId": 1
        }
      ]
    }
  ],
  "error": null
}
```

---

### 5. Get All Test Questions (Simple)

**Endpoint:** `GET /api/TestQuestionOption/GetAllTestQuestion`  
**Description:** Retrieve all questions for a test with simplified option details  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `TestId` | integer | Yes | Psychology Test ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "testSectionId": 1,
      "testSectionTitle": "Personal Traits",
      "testSectionDescription": "Questions about your personal characteristics",
      "questions": [
        {
          "id": 1,
          "questionText": "How often do you feel stressed?",
          "options": [
            {
              "id": 1,
              "optionText": "Never"
            },
            {
              "id": 2,
              "optionText": "Rarely"
            }
          ]
        }
      ]
    }
  ],
  "error": null
}
```

---

### 6. Get Test Question By ID

**Endpoint:** `GET /api/TestQuestionOption/GetById`  
**Description:** Retrieve a specific test question  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Id` | integer | Yes | Question ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": 1,
    "questionText": "How often do you feel stressed?",
    "testSectionId": 1,
    "testSectionTitle": "Personal Traits",
    "testSectionDescription": "Questions about your personal characteristics",
    "options": [
      {
        "id": 1,
        "optionText": "Never",
        "scoreValue": 1,
        "testQuestionId": 1
      }
    ]
  },
  "error": null
}
```

---

## User Test Session Controller

**Group:** Test  
**Base Route:** `/api/UserTestSession`

### 1. Create User Test Session

**Endpoint:** `POST /api/UserTestSession/Create`  
**Description:** Create a new user test session with answers  
**Authentication:** Not required

#### Request Body

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "psychologyTestId": 1,
  "startedAt": "2026-06-12T10:00:00Z",
  "completedAt": "2026-06-12T10:30:00Z",
  "answerRecords": [
    {
      "userTestSessionId": 0,
      "testQuestionId": 1,
      "selectedOptionId": 3
    },
    {
      "userTestSessionId": 0,
      "testQuestionId": 2,
      "selectedOptionId": 5
    }
  ]
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | GUID | Yes | User's unique identifier |
| `psychologyTestId` | integer | Yes | Psychology Test ID |
| `startedAt` | datetime | Yes | Session start time |
| `completedAt` | datetime | No | Session completion time |
| `answerRecords` | array | Yes | User's answers |
| `answerRecords[].userTestSessionId` | integer | Yes | Set to 0 for creation |
| `answerRecords[].testQuestionId` | integer | Yes | Question ID |
| `answerRecords[].selectedOptionId` | integer | Yes | Selected option ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "User test session created successfully",
  "data": {
    "id": 1,
    "psychologyTestId": 1,
    "psychologyTestName": "Personality Assessment",
    "startedAt": "2026-06-12T10:00:00Z",
    "completedAt": "2026-06-12T10:30:00Z",
    "hasPaidForTest": false,
    "hasUnlockedReport": false,
    "answerRecords": [
      {
        "id": 1,
        "userTestSessionId": 1,
        "testQuestionId": 1,
        "selectedOptionId": 3
      }
    ]
  },
  "error": null
}
```

---

### 2. Delete User Test Session

**Endpoint:** `DELETE /api/UserTestSession/delete/{id}`  
**Description:** Delete a user test session  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `UserId` | GUID | Yes | User's unique identifier |
| `id` | integer | Yes | Session ID (from route) |

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Session ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "User test session deleted successfully",
  "data": null,
  "error": null
}
```

---

### 3. Get All User Test Sessions

**Endpoint:** `GET /api/UserTestSession/GetAll`  
**Description:** Retrieve all test sessions for a user  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `UserId` | GUID | Yes | User's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "psychologyTestId": 1,
      "psychologyTestName": "Personality Assessment",
      "startedAt": "2026-06-12T10:00:00Z",
      "completedAt": "2026-06-12T10:30:00Z",
      "hasPaidForTest": false,
      "hasUnlockedReport": false,
      "answerRecords": [...]
    }
  ],
  "error": null
}
```

---

### 4. Get User Test Session By ID

**Endpoint:** `GET /api/UserTestSession/GetById`  
**Description:** Retrieve a specific user test session  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `UserId` | GUID | Yes | User's unique identifier |
| `Id` | integer | Yes | Session ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": 1,
    "psychologyTestId": 1,
    "psychologyTestName": "Personality Assessment",
    "startedAt": "2026-06-12T10:00:00Z",
    "completedAt": "2026-06-12T10:30:00Z",
    "hasPaidForTest": false,
    "hasUnlockedReport": false,
    "answerRecords": [
      {
        "id": 1,
        "userTestSessionId": 1,
        "testQuestionId": 1,
        "selectedOptionId": 3
      }
    ]
  },
  "error": null
}
```

---

### 5. Get User Report

**Endpoint:** `GET /api/UserTestSession/GetUserReport`  
**Description:** Retrieve the generated report for a test session  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userTestSessionId` | integer | Yes | Session ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "userTestSessionId": 1,
    "totalScore": 85,
    "reportDetails": "Your personality profile indicates...",
    "scoringRule": {
      "minScore": 80,
      "maxScore": 100,
      "reportDetails": "High achiever personality traits"
    }
  },
  "error": null
}
```

---

## Scoring Rule Controller

**Group:** Test  
**Base Route:** `/api/ScoringRule`

### 1. Create Scoring Rule

**Endpoint:** `POST /api/ScoringRule/Create`  
**Description:** Create a new scoring rule for test results interpretation  
**Authentication:** Not required

#### Request Body

```json
{
  "psychologyTestId": 1,
  "minScore": 0,
  "maxScore": 20,
  "reportDetails": "Low stress level: You manage stress very well."
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `psychologyTestId` | integer | Yes | Foreign key to PsychologyTest |
| `minScore` | integer | Yes | Minimum score for this range |
| `maxScore` | integer | Yes | Maximum score for this range |
| `reportDetails` | string | Yes | Report text for this score range |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Scoring rule created successfully",
  "data": {
    "id": 1,
    "psychologyTestId": 1,
    "psychologyTest": "Personality Assessment",
    "minScore": 0,
    "maxScore": 20,
    "reportDetails": "Low stress level: You manage stress very well."
  },
  "error": null
}
```

---

### 2. Update Scoring Rule

**Endpoint:** `PUT /api/ScoringRule/Update`  
**Description:** Update an existing scoring rule  
**Authentication:** Not required

#### Request Body

```json
{
  "id": 1,
  "minScore": 0,
  "maxScore": 25,
  "reportDetails": "Updated: Low stress level with excellent coping mechanisms."
}
```

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Scoring rule updated successfully",
  "data": {
    "id": 1,
    "psychologyTestId": 1,
    "psychologyTest": "Personality Assessment",
    "minScore": 0,
    "maxScore": 25,
    "reportDetails": "Updated: Low stress level with excellent coping mechanisms."
  },
  "error": null
}
```

---

### 3. Delete Scoring Rule

**Endpoint:** `DELETE /api/ScoringRule/delete/{id}`  
**Description:** Delete a scoring rule  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Scoring rule ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Scoring rule deleted successfully",
  "data": null,
  "error": null
}
```

---

### 4. Get All Scoring Rules

**Endpoint:** `GET /api/ScoringRule/GetAll`  
**Description:** Retrieve all scoring rules across all tests  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "psychologyTestId": 1,
      "psychologyTest": "Personality Assessment",
      "minScore": 0,
      "maxScore": 20,
      "reportDetails": "Low stress level"
    },
    {
      "id": 2,
      "psychologyTestId": 1,
      "psychologyTest": "Personality Assessment",
      "minScore": 21,
      "maxScore": 40,
      "reportDetails": "Moderate stress level"
    }
  ],
  "error": null
}
```

---

### 5. Get All Scoring Rules for Test

**Endpoint:** `GET /api/ScoringRule/GetAllRuleForTest`  
**Description:** Retrieve all scoring rules for a specific test  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `testId` | integer | Yes | Psychology Test ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "psychologyTestId": 1,
      "psychologyTest": "Personality Assessment",
      "minScore": 0,
      "maxScore": 20,
      "reportDetails": "Low stress level"
    }
  ],
  "error": null
}
```

---

### 6. Get Scoring Rule By ID

**Endpoint:** `GET /api/ScoringRule/GetById`  
**Description:** Retrieve a specific scoring rule  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Id` | integer | Yes | Scoring rule ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": 1,
    "psychologyTestId": 1,
    "psychologyTest": "Personality Assessment",
    "minScore": 0,
    "maxScore": 20,
    "reportDetails": "Low stress level"
  },
  "error": null
}
```

---

## Generated Test Report Controller

**Group:** Test  
**Base Route:** `/api/GeneratedTestReport`

### 1. Create Generated Test Report

**Endpoint:** `POST /api/GeneratedTestReport/Create`  
**Description:** Generate a test report for a user test session  
**Authentication:** Not required

#### Request Body

```json
{
  "userTestSessionId": 1,
  "scoringRuleId": 2,
  "generatedAt": "2026-06-12T11:00:00Z"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userTestSessionId` | integer | Yes | Foreign key to UserTestSession |
| `scoringRuleId` | integer | Yes | Foreign key to ScoringRule |
| `generatedAt` | datetime | Yes | Report generation timestamp |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test report generated successfully",
  "data": {
    "id": 1,
    "userTestSessionId": 1,
    "scoringRuleId": 2,
    "generatedAt": "2026-06-12T11:00:00Z",
    "psychologyTestName": "Personality Assessment",
    "scoringRuleRange": "21-40"
  },
  "error": null
}
```

---

### 2. Delete Generated Test Report

**Endpoint:** `DELETE /api/GeneratedTestReport/delete/{id}`  
**Description:** Delete a generated test report  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Report ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Test report deleted successfully",
  "data": null,
  "error": null
}
```

---

### 3. Get All Generated Test Reports

**Endpoint:** `GET /api/GeneratedTestReport/GetAll`  
**Description:** Retrieve all generated test reports  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "userTestSessionId": 1,
      "scoringRuleId": 2,
      "generatedAt": "2026-06-12T11:00:00Z",
      "psychologyTestName": "Personality Assessment",
      "scoringRuleRange": "21-40"
    }
  ],
  "error": null
}
```

---

### 4. Get Generated Test Report By ID

**Endpoint:** `GET /api/GeneratedTestReport/GetById`  
**Description:** Retrieve a specific generated test report  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `Id` | integer | Yes | Report ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": 1,
    "userTestSessionId": 1,
    "scoringRuleId": 2,
    "generatedAt": "2026-06-12T11:00:00Z",
    "psychologyTestName": "Personality Assessment",
    "scoringRuleRange": "21-40"
  },
  "error": null
}
```

---

## Appointment Controller

**Group:** Appointment  
**Base Route:** `/api/Appointment`

### Consultants Endpoints

#### 1. Get Consultant Card

**Endpoint:** `GET /api/Appointment/GetConsultantCard/{userId}`  
**Description:** Retrieve consultant card information (brief profile)  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (GUID) | Yes | Consultant's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": "guid",
    "fullName": "Dr. Consultant",
    "specialization": ["Marriage Counseling", "Child Psychology"],
    "rating": 4.8,
    "totalSessions": "150",
    "profileImage": "https://storage.example.com/profile.jpg",
    "nextAvailable": "2026-06-13 10:00 AM",
    "sessionDetails": {
      "duration": "60 minutes",
      "price": "100 SAR"
    }
  },
  "error": null
}
```

---

#### 2. Get Consultant Profile

**Endpoint:** `GET /api/Appointment/GetConsultantProfile/{consultantId}`  
**Description:** Retrieve full consultant profile with education and experience  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `consultantId` | string (GUID) | Yes | Consultant's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": "guid",
    "fullName": "Dr. Consultant",
    "profileImageUrl": "https://storage.example.com/profile.jpg",
    "jobTitle": "Clinical Psychologist",
    "nationality": "Saudi Arabia",
    "language": "Arabic, English",
    "experienceYears": "10",
    "specializations": ["Marriage Counseling", "Child Psychology"],
    "educationHistory": [
      {
        "id": 1,
        "degree": "PhD in Clinical Psychology",
        "startDate": "2008-09-01T00:00:00Z",
        "endDate": "2012-06-01T00:00:00Z",
        "description": "Specialized in cognitive behavioral therapy",
        "major": "Clinical Psychology",
        "university": "King Saud University"
      }
    ],
    "workExperience": [
      {
        "id": 1,
        "jobTitle": "Senior Psychologist",
        "companyName": "Mental Health Center",
        "startDate": "2012-07-01T00:00:00Z",
        "endDate": "2020-12-31T00:00:00Z",
        "description": "Provided therapy sessions for couples and families",
        "userId": "guid"
      }
    ],
    "totalSessions": 150,
    "averageRating": 4.8,
    "totalRatingsCount": 120,
    "overallSatisfaction": 4.9,
    "clarityOfInformation": 4.7,
    "comfortAndSafety": 4.8,
    "punctuality": 4.9,
    "understanding": 4.8
  },
  "error": null
}
```

---

#### 3. Update Consultant Profile

**Endpoint:** `PUT /api/Appointment/UpdateConsultantProfile`  
**Description:** Update consultant profile information  
**Authentication:** Not required  
**Content-Type:** `multipart/form-data`

#### Request Body (Form Data)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ConsultantId` | string | Yes | Consultant's unique identifier |
| `FullName` | string | No | Consultant's full name |
| `UserName` | string | No | Consultant's username |
| `PhoneNumber` | string | No | Phone number |
| `WhatsAppNumber` | string | No | WhatsApp number |
| `NationalityId` | integer | No | Foreign key to Nationality |
| `Gender` | integer | No | Gender enum |
| `MaritalStatus` | integer | No | Marital status enum |
| `Qualification` | string | No | Education qualification |
| `ExperienceYears` | string | No | Years of experience |
| `SessionPrice` | integer | No | Session price |
| `SpecializationIds` | array[integer] | No | List of specialization IDs |
| `ProfileImage` | file | No | Profile image file |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Consultant profile updated successfully",
  "data": null,
  "error": null
}
```

---

#### 4. Get Married Consultant

**Endpoint:** `GET /api/Appointment/GetMarriedConsultant`  
**Description:** Retrieve a specific married consultant (hardcoded ID)  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": "d06d819e-7424-4f13-8d98-4e1aa90632df",
    "fullName": "Married Consultant",
    ...
  },
  "error": null
}
```

---

#### 5. Get Consultant Time

**Endpoint:** `GET /api/Appointment/GetConsultantTime{consultantId}`  
**Description:** Get consultant's available time slots  
**Authentication:** Not required

#### Route Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `consultantId` | string (GUID) | Yes | Consultant's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "consultantId": "guid",
    "availableTimes": [
      {
        "dayOfWeek": "Monday",
        "timeSlots": [
          {
            "startTime": "09:00",
            "endTime": "10:00",
            "isBooked": false
          },
          {
            "startTime": "10:00",
            "endTime": "11:00",
            "isBooked": true
          }
        ]
      }
    ]
  },
  "error": null
}
```

---

#### 6. Add or Update Consultant Availability

**Endpoint:** `POST /api/Appointment/AddOrUpdateConsultantAvailability`  
**Description:** Set consultant's weekly availability schedule  
**Authentication:** Not required

#### Request Body

```json
{
  "userId": "guid",
  "days": [
    {
      "day": 1,
      "timeRanges": [
        {
          "startTime": "09:00:00",
          "endTime": "13:00:00"
        },
        {
          "startTime": "15:00:00",
          "endTime": "18:00:00"
        }
      ]
    }
  ]
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | Consultant's unique identifier |
| `days` | array | Yes | List of availability days |
| `days[].day` | integer | Yes | Day of week (0=Sunday, 6=Saturday) |
| `days[].timeRanges` | array | Yes | Time ranges for the day |
| `days[].timeRanges[].startTime` | time | Yes | Start time |
| `days[].timeRanges[].endTime` | time | Yes | End time |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Availability updated successfully",
  "data": null,
  "error": null
}
```

---

#### 7. Get Consultant Availability For Next Days

**Endpoint:** `GET /api/Appointment/GetConsultantAvailabilityForNextDays`  
**Description:** Get consultant's availability for upcoming days  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `consultantId` | string (GUID) | Yes | Consultant's unique identifier |
| `searchDate` | datetime | No | Start date (defaults to today) |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "consultantId": "guid",
    "availability": [
      {
        "date": "2026-06-13",
        "dayOfWeek": "Saturday",
        "timeSlots": [
          {
            "startTime": "09:00",
            "endTime": "10:00",
            "isAvailable": true
          }
        ]
      }
    ]
  },
  "error": null
}
```

---

#### 8. Get All Consultants

**Endpoint:** `GET /api/Appointment/GetAllConsultant`  
**Description:** Retrieve all consultants (approved only)  
**Authentication:** Not required

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": "guid",
      "fullName": "Dr. Consultant",
      "specialization": ["Marriage Counseling"],
      "rating": 4.8,
      "totalSessions": "150",
      "profileImage": "https://...",
      "nextAvailable": "2026-06-13 10:00 AM",
      "sessionDetails": {
        "duration": "60 minutes",
        "price": "100 SAR"
      }
    }
  ],
  "error": null
}
```

---

#### 9. Get All Consultants (Urgent and Normal)

**Endpoint:** `GET /api/Appointment/GetAllConsultantUrgentAndNormal`  
**Description:** Retrieve consultants categorized by urgent/normal availability  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Search by name or specialization |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "urgentConsultants": [
      {
        "id": "guid",
        "fullName": "Dr. Urgent Consultant",
        "specialization": ["Crisis Counseling"],
        "rating": 5,
        "totalSessions": "200",
        "profileImage": "https://...",
        "nextAvailable": "Today 2:00 PM",
        "nextAvailableDate": "2026-06-12T14:00:00Z",
        "sessionDetails": {
          "duration": "60 minutes",
          "price": "150 SAR"
        }
      }
    ],
    "normalConsultants": [...]
  },
  "error": null
}
```

---

### Appointments Endpoints

#### 10. Get All Appointments For User

**Endpoint:** `GET /api/Appointment/GetAllAppointmentForUser`  
**Description:** Retrieve all appointments for a specific user  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string (GUID) | Yes | User's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "userId": "guid",
      "consultantId": "guid",
      "consultantName": "Dr. Consultant",
      "date": "2026-06-15T00:00:00Z",
      "startTime": "10:00:00",
      "endTime": "11:00:00",
      "bookingType": "Regular",
      "bookingOption": "Video Call",
      "status": "Confirmed",
      "hasConsultantMessage": false
    }
  ],
  "error": null
}
```

---

#### 11. Create Appointment

**Endpoint:** `POST /api/Appointment/CreateAppointment`  
**Description:** Create a new appointment  
**Authentication:** Not required

#### Request Body

```json
{
  "userId": "guid",
  "consultantId": "guid",
  "date": "2026-06-15T00:00:00Z",
  "startTime": "10:00:00",
  "endTime": "11:00:00",
  "bookingType": "Regular",
  "bookingOption": "Video Call",
  "hasConsultantMessage": false
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | string | Yes | User's unique identifier |
| `consultantId` | string | Yes | Consultant's unique identifier |
| `date` | datetime | Yes | Appointment date |
| `startTime` | time | Yes | Start time |
| `endTime` | time | Yes | End time |
| `bookingType` | string | Yes | "Regular" or "Urgent" |
| `bookingOption` | string | No | "Video Call", "Phone Call", etc. |
| `hasConsultantMessage` | boolean | Yes | Consultant message flag |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Appointment created successfully",
  "data": {
    "id": 1,
    "userId": "guid",
    "consultantId": "guid",
    "date": "2026-06-15T00:00:00Z",
    "startTime": "10:00:00",
    "endTime": "11:00:00",
    "status": "Pending"
  },
  "error": null
}
```

---

#### 12. Change Appointment Status

**Endpoint:** `PATCH /api/Appointment/ChangeAppointmentStatus`  
**Description:** Update appointment status  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `AppointmentId` | integer | Yes | Appointment ID |
| `UserOrConsultantId` | string (GUID) | Yes | User or consultant ID making the change |
| `appointmentStatus` | integer | Yes | Status enum (0=Pending, 1=Confirmed, 2=Completed, 3=Canceled) |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Appointment status updated",
  "data": null,
  "error": null
}
```

---

#### 13. Previous Appointments For User

**Endpoint:** `GET /api/Appointment/PreviousAppointmentsForUser`  
**Description:** Retrieve user's past appointments  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `UserId` | string (GUID) | Yes | User's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 1,
      "consultantName": "Dr. Consultant",
      "date": "2026-05-15T00:00:00Z",
      "startTime": "10:00:00",
      "endTime": "11:00:00",
      "status": "Completed"
    }
  ],
  "error": null
}
```

---

#### 14. Upcoming Appointments For User

**Endpoint:** `GET /api/Appointment/upcomingAppointmentsForUser`  
**Description:** Retrieve user's upcoming appointments  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `UserId` | string (GUID) | Yes | User's unique identifier |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": [
    {
      "id": 2,
      "consultantName": "Dr. Consultant",
      "date": "2026-06-15T00:00:00Z",
      "startTime": "10:00:00",
      "endTime": "11:00:00",
      "status": "Confirmed"
    }
  ],
  "error": null
}
```

---

#### 15. Reschedule Appointment

**Endpoint:** `PUT /api/Appointment/RescheduleAppointment`  
**Description:** Reschedule an existing appointment  
**Authentication:** Not required

#### Request Body

```json
{
  "appointmentId": 1,
  "requestedById": "guid",
  "newDate": "2026-06-16T00:00:00Z",
  "newStartTime": "14:00:00",
  "newEndTime": "15:00:00",
  "reason": "Personal conflict"
}
```

#### Request Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `appointmentId` | integer | Yes | Appointment ID |
| `requestedById` | string | Yes | User or consultant ID requesting change |
| `newDate` | datetime | Yes | New appointment date |
| `newStartTime` | time | Yes | New start time |
| `newEndTime` | time | Yes | New end time |
| `reason` | string | No | Reason for rescheduling |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Appointment rescheduled successfully",
  "data": null,
  "error": null
}
```

---

### Evaluations Endpoints

#### 16. Create Evaluation

**Endpoint:** `POST /api/Appointment/appointmentsEvaluation`  
**Description:** Create evaluation/rating for a completed appointment  
**Authentication:** Not required

#### Request Body

```json
{
  "appointmentId": 1,
  "overallSatisfaction": 5,
  "clarityOfInformation": 5,
  "comfortAndSafety": 5,
  "consultantPunctuality": 5,
  "consultantUnderstanding": 5,
  "comments": "Excellent session, very helpful"
}
```

#### Request Schema

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `appointmentId` | integer | Yes | - | Appointment ID |
| `overallSatisfaction` | integer | Yes | 1-5 | Overall satisfaction rating |
| `clarityOfInformation` | integer | Yes | 1-5 | Clarity rating |
| `comfortAndSafety` | integer | Yes | 1-5 | Comfort and safety rating |
| `consultantPunctuality` | integer | Yes | 1-5 | Punctuality rating |
| `consultantUnderstanding` | integer | Yes | 1-5 | Understanding rating |
| `comments` | string | No | Max 250 chars | Optional comments |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Evaluation submitted successfully",
  "data": {
    "id": 1,
    "appointmentId": 1,
    "overallSatisfaction": 5,
    "clarityOfInformation": 5,
    "comfortAndSafety": 5,
    "consultantPunctuality": 5,
    "consultantUnderstanding": 5,
    "comments": "Excellent session, very helpful"
  },
  "error": null
}
```

---

#### 17. Get Evaluation

**Endpoint:** `GET /api/Appointment/getEvaluation`  
**Description:** Retrieve evaluation for an appointment  
**Authentication:** Not required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `appointmentId` | integer | Yes | Appointment ID |

#### Success Response (200 OK)

```json
{
  "succeeded": true,
  "status": "Success",
  "message": null,
  "data": {
    "id": 1,
    "appointmentId": 1,
    "overallSatisfaction": 5,
    "clarityOfInformation": 5,
    "comfortAndSafety": 5,
    "consultantPunctuality": 5,
    "consultantUnderstanding": 5,
    "comments": "Excellent session, very helpful"
  },
  "error": null
}
```

---

## Consultant Education Controller

**Group:** ConsultantService  
**Base Route:** `/api/ConsultantEducation`

This controller manages consultant education history.

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/GetEducationsByConsultantId/{consultantId}` | Get all education records for a consultant |
| POST | `/CreateEducation` | Create new education record |
| PUT | `/UpdateEducation/{id}` | Update existing education record |
| DELETE | `/DeleteEducation/{id}?consultantId={guid}` | Delete education record |

---

## Consultant Experience Controller

**Group:** ConsultantService  
**Base Route:** `/api/ConsultantExperience`

This controller manages consultant work experience.

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/GetExperiencesByConsultantId/{consultantId}` | Get all experience records for a consultant |
| POST | `/CreateExperience` | Create new experience record |
| PUT | `/UpdateExperience/{id}` | Update existing experience record |
| DELETE | `/DeleteExperience/{id}?consultantId={guid}` | Delete experience record |

---

## Admin Consultant Controller

**Group:** Admin  
**Base Route:** `/api/AdminConsultant`  
**Authentication:** Required (Admin role only)

This controller provides admin operations for managing consultants.

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/GetActiveConsultantsCount` | Get count of active consultants |
| POST | `/Approve/{id}` | Toggle consultant's active status (approve/unapprove) |
| POST | `/Block/{id}` | Toggle consultant's block status |
| DELETE | `/Delete/{id}` | Delete a consultant |
| GET | `/GetDashboardStats` | Get admin dashboard statistics |

---

## Articles Controller

**Group:** Articles  
**Base Route:** `/api/Articles`

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/AddCategory` | Create new article category |
| GET | `/GetAllCategories` | Get all categories |
| GET | `/GetCategoryById/{id}` | Get specific category |
| PATCH | `/UpdateCategory/{id}?CategoryName={name}` | Update category name |
| DELETE | `/DeleteCategory/{id}` | Delete category |

### Article Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/AddArticle` | Create new article (multipart/form-data) |
| PUT | `/UpdateArticle/{id}` | Update article (multipart/form-data) |
| DELETE | `/DeleteArticle/{id}` | Delete article |
| GET | `/GetArticles?categoryId={id}&sortOrder={asc/desc}&search={text}` | Get articles with filters |
| GET | `/GetArticleDetails/{articleId}` | Get full article with sections |
| GET | `/GetCategoryWithArticles/{id}` | Get category with its articles |

### Article Section Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/AddSection` | Add section to article |
| DELETE | `/DeleteArticleSections/{articleId}` | Delete all sections for an article |

---

## Lookup Controller

**Group:** Lookup  
**Base Route:** `/api/Lookup`

This controller manages lookup/reference data.

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/AddNationality` | Add nationality |
| GET | `/GetAllNationalities` | Get all nationalities |
| POST | `/AddSpecialization` | Add specialization |
| GET | `/GetAllSpecializations` | Get all specializations |
| POST | `/AddContactTime` | Add contact time |
| GET | `/GetAllContactTimes` | Get all contact times |
| POST | `/AddPlan` | Add subscription plan |
| POST | `/AddUserSubscription` | Assign subscription to user |
| POST | `/AddWeeklyAvailability/{userId}` | Set weekly availability |
| GET | `/GetMonthlyAvailability/{userId}?daysInMonth={days}` | Get monthly availability |
| GET | `/GetUserSubscriptions/{userId}` | Get user subscriptions |
| GET | `/GetAllGender` | Get all gender options |
| GET | `/GetAllMaritalStatus` | Get all marital status options |
| GET | `/GetAllAppointmentStatus` | Get all appointment status options |
| GET | `/GetDaysName` | Get days of week |

---

## Notification Controller

**Group:** Notification  
**Base Route:** `/api/Notification`

### Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/Add` | Create notification |
| GET | `/GetAll/{userId}` | Get all notifications for user |
| PATCH | `/MarkAsRead/{notificationId}?userId={guid}` | Mark single notification as read |
| PATCH | `/MarkAllAsRead/{userId}` | Mark all notifications as read |
| DELETE | `/DeleteNotificationForUser/{notificationId}?userId={guid}` | Delete notification |

---

## Subscription Controller

**Group:** Subscription  
**Base Route:** `/api/Subscription`

### Endpoints Summary

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| POST | `/AddSubscriptionWithBenefits` | No | Create subscription plan with benefits |
| GET | `/GetAllSubscriptionsWithBenefits` | No | Get all subscription plans |
| POST | `/AssignSubscriptionToUser?userId={guid}&subscriptionPlanId={id}` | Yes (User role) | Assign subscription to user |
| GET | `/GetUserSubscription/{userId}` | Yes (User role) | Get user's active subscription |

---

## Settings Controller

**Group:** Settings  
**Base Route:** `/api/Settings`

### FAQs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/GetAllFAQs` | Get all FAQs |
| GET | `/GetFAQ/{id}` | Get specific FAQ |
| POST | `/AddFAQ` | Create new FAQ |
| PUT | `/UpdateFAQ/{id}` | Update FAQ |
| DELETE | `/DeleteFAQ/{id}` | Delete FAQ |

### Technical Support Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/GetTechnicalSupport` | Get technical support contact info |
| PUT | `/UpdateTechnicalSupport` | Update technical support info |

### Security & Privacy Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/GetSecurityAndPrivacy` | Get security and privacy policy |
| PUT | `/UpdateSecurityAndPrivacy` | Update security and privacy policy |

---

## AI Chat Controller

**Group:** AIChat  
**Base Route:** `/api/ai-chat`

This controller proxies requests to the Python AI Chat service.

### Chat Endpoints

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| POST | `/chat` | Yes | Send text message to AI |
| POST | `/voice-chat` | Yes | Send voice message (multipart/form-data) |
| POST | `/upload` | Yes (Admin) | Upload documents to AI knowledge base |

### Conversation Management

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| POST | `/conversations/new` | Yes | Create new conversation |
| GET | `/conversations` | Yes | Get all conversations |
| GET | `/conversations/{conversationId}` | Yes | Get specific conversation |
| DELETE | `/conversations/{conversationId}` | Yes | Delete conversation |

### System Endpoints

| Method | Endpoint | Authentication | Description |
|--------|----------|----------------|-------------|
| GET | `/system/status` | Yes (Admin) | Get AI Chat system status |
| GET | `/system/health` | Yes (Admin) | Health check |

**Example AI Chat Request:**

```json
{
  "message": "Hello, I need help with stress management",
  "conversationId": "conversation-123"
}
```

**Example AI Chat Response:**

```json
{
  "succeeded": true,
  "status": "Success",
  "message": "Operation completed successfully",
  "data": {
    "response": "I understand you're dealing with stress...",
    "conversationId": "conversation-123"
  },
  "error": null
}
```

---

