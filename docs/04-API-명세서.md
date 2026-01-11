# CareBridge Korea - API 명세서

## Base URL

```
Development: http://localhost:3000/api/v1
Production: TBD
```

## 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

### 에러 응답
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지"
  }
}
```

### 페이지네이션 응답
```json
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "totalItems": 100,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 10,
      "currentPage": 1
    }
  }
}
```

---

## 1. Authentication API

### 1.1 회원가입
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER"
  },
  "message": "회원가입이 완료되었습니다."
}
```

---

### 1.2 로그인
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
    }
  }
}
```

---

### 1.3 토큰 재발급
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 1.4 비밀번호 변경
```
PATCH /api/v1/auth/password
```

**Headers:** `Authorization: Bearer {accessToken}`

**Request Body:**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다."
}
```

---

## 2. User API

### 2.1 내 정보 조회
```
GET /api/v1/users/me
```

**Headers:** `Authorization: Bearer {accessToken}`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2.2 유저 전체 조회 (Admin)
```
GET /api/v1/admin/users
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Query Parameters:**
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "email": "user@example.com",
        "role": "USER",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "meta": {
      "totalItems": 50,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 5,
      "currentPage": 1
    }
  }
}
```

---

### 2.3 유저 단일 조회 (Admin)
```
GET /api/v1/admin/users/:id
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 3. Consultation API

### 3.1 상담 접수
```
POST /api/v1/consultations
```

**Request Body:**
```json
{
  "userNickname": "John Doe",
  "contactType": "KAKAOTALK",
  "contactInfo": "john_doe",
  "nationality": "USA",
  "language": "English",
  "location": "Seoul",
  "symptoms": "I have a headache and fever",
  "preferredAt": "2024-01-15T14:00:00Z"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userNickname": "John Doe",
    "status": "NEW",
    "createdAt": "2024-01-10T00:00:00Z"
  },
  "message": "상담이 접수되었습니다."
}
```

---

### 3.2 상담 목록 조회 (Admin)
```
GET /api/v1/admin/consultations
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Query Parameters:**
- `status`: 상태 필터 (NEW, IN_PROGRESS, COMPLETED)
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "userNickname": "John Doe",
        "contactType": "KAKAOTALK",
        "status": "NEW",
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ],
    "meta": {
      "totalItems": 100,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 10,
      "currentPage": 1
    }
  }
}
```

---

### 3.3 상담 상세 조회 (Admin)
```
GET /api/v1/admin/consultations/:id
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": null,
    "userNickname": "John Doe",
    "contactType": "KAKAOTALK",
    "contactInfo": "john_doe",
    "nationality": "USA",
    "language": "English",
    "location": "Seoul",
    "symptoms": "I have a headache and fever",
    "preferredAt": "2024-01-15T14:00:00Z",
    "status": "NEW",
    "adminMemo": null,
    "createdAt": "2024-01-10T00:00:00Z",
    "recommendations": []
  }
}
```

---

### 3.4 상담 상태/메모 수정 (Admin)
```
PATCH /api/v1/admin/consultations/:id
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "adminMemo": "환자 연락 완료, 병원 추천 예정"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "IN_PROGRESS",
    "adminMemo": "환자 연락 완료, 병원 추천 예정"
  }
}
```

---

## 4. Hospital API

### 4.1 병원 등록 (Admin)
```
POST /api/v1/admin/hospitals
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Request Body:**
```json
{
  "name": "서울대학교병원",
  "region": "서울",
  "department": "내과",
  "isForeignFriendly": true
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "서울대학교병원",
    "region": "서울",
    "department": "내과",
    "isForeignFriendly": true,
    "createdAt": "2024-01-10T00:00:00Z"
  }
}
```

---

### 4.2 병원 목록 조회 (Admin)
```
GET /api/v1/admin/hospitals
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Query Parameters:**
- `region`: 지역 필터
- `department`: 진료과 필터
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "서울대학교병원",
        "region": "서울",
        "department": "내과",
        "isForeignFriendly": true
      }
    ],
    "meta": {
      "totalItems": 50,
      "itemCount": 10,
      "itemsPerPage": 10,
      "totalPages": 5,
      "currentPage": 1
    }
  }
}
```

---

### 4.3 병원 정보 수정 (Admin)
```
PATCH /api/v1/admin/hospitals/:id
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Request Body:**
```json
{
  "name": "서울대학교병원 (본원)",
  "isForeignFriendly": true
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "서울대학교병원 (본원)",
    "region": "서울",
    "department": "내과",
    "isForeignFriendly": true,
    "updatedAt": "2024-01-11T00:00:00Z"
  }
}
```

---

### 4.4 병원 삭제 (Admin)
```
DELETE /api/v1/admin/hospitals/:id
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Response (200):**
```json
{
  "success": true,
  "message": "병원이 삭제되었습니다."
}
```

---

## 5. Recommendation API

### 5.1 병원 추천 등록 (Admin)
```
POST /api/v1/admin/recommendations
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Request Body:**
```json
{
  "consultationId": 1,
  "hospitalIds": [1, 2, 3]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "ids": [10, 11, 12]
  },
  "message": "3건의 병원 추천이 등록되었습니다."
}
```

---

### 5.2 사용자 선택 기록
```
PATCH /api/v1/recommendations/:id/select
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "isSelected": true,
    "selectedAt": "2024-01-12T10:30:00Z"
  }
}
```

---

### 5.3 예약 결과 기록 (Admin)
```
PATCH /api/v1/admin/recommendations/:id/result
```

**Headers:** `Authorization: Bearer {accessToken}` (Admin only)

**Request Body:**
```json
{
  "bookingStatus": "SUCCESS"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "bookingStatus": "SUCCESS"
  }
}
```

---

## 에러 코드

| 코드 | HTTP Status | 설명 |
|------|-------------|------|
| UNAUTHORIZED | 401 | 인증되지 않은 요청 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스를 찾을 수 없음 |
| VALIDATION_ERROR | 400 | 입력값 검증 실패 |
| DUPLICATE_ENTRY | 409 | 중복된 데이터 |
| INTERNAL_ERROR | 500 | 서버 내부 오류 |
