# Data Seeding Plan & JSON

This plan details the minimal data required to seed the database to satisfy all scenarios in the `e2e` tests. Based on `schemas.puml`, we have reduced the data to the absolute minimum needed.
You can use the JSON blocks below to directly insert into MongoDB.

## Optimization Strategy

- **Minimal Users**: Only users explicitly tested (1 Student with data, 1 Parent, 1 Admin, 1 Reset User, 1 New Student for onboarding).
- **Shared Entities**: Use a single active Arena, Assessment, Topic, and Lecture.
- **Specific Exercises**: For the `e2e/assessment-arena.spec.ts` test, we ensure exactly 5 exercises with specific types for the Arena, and 1 for the Assessment.

---

### 1. Families (`families`)

### 2. Grades (`grades`)

```json
[
  {
    "_id": {
      "$oid": "69097372174a26d707e30173"
    },
    "name": "Lớp 1",
    "level": 1,
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_1_kbz1s9.svg",
    "worldId": {
      "$oid": "690971caaa3ca865cb0413b4"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6909737e174a26d707e30175"
    },
    "name": "Lớp 2",
    "level": 2,
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_2_ht8tak.svg",
    "worldId": {
      "$oid": "690971d9174a26d707e3016d"
    },
    "__v": 0,
    "updatedAt": {
      "$date": "2026-02-05T09:06:09.244Z"
    }
  },
  {
    "_id": {
      "$oid": "6909738a174a26d707e30177"
    },
    "name": "Lớp 3",
    "level": 3,
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_3_hknkoj.svg",
    "worldId": {
      "$oid": "690971e3174a26d707e3016f"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "69097392aa3ca865cb0413ba"
    },
    "name": "Lớp 4",
    "level": 4,
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_4_dnmbuk.svg",
    "worldId": {
      "$oid": "690971ee174a26d707e30171"
    },
    "__v": 0
  },
  {
    "_id": {
      "$oid": "6909739a174a26d707e30179"
    },
    "name": "Lớp 5",
    "level": 5,
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_5_is3eqc.svg",
    "worldId": {
      "$oid": "690971f7aa3ca865cb0413b6"
    },
    "__v": 0
  }
]
```

### 3. Users (`users`)

```json
[
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b94" },
    "email": "admin@dino.com",
    "password": "$2b$10$YourHashedPasswordFor_admin@123",
    "role": "admin",
    "status": "active"
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b95" },
    "username": "reset_user",
    "password": "$2b$10$YourHashedPasswordFor_OldPassword@1",
    "role": "student",
    "status": "active",
    "resetPasswordToken": "123456",
    "resetPasswordExpires": { "$date": "2026-12-31T23:59:59Z" }
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b96" },
    "username": "new_student1",
    "password": "$2b$10$YourHashedPasswordFor_NewStudent1@",
    "role": "student",
    "status": "active"
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b97" },
    "username": "student1",
    "password": "$2b$10$YourHashedPasswordFor_Student1@rcv",
    "role": "student",
    "status": "active",
    "name": "Student Features",
    "familyId": { "$oid": "60d5ec9af682fbd39a1b8ba0" }
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b98" },
    "email": "testparent@example.com",
    "password": "$2b$10$YourHashedPasswordFor_Parent1@",
    "role": "parent",
    "status": "active",
    "name": "Test Parent"
  }
]
```

**Note:**

- `new_student1` is used for Onboarding testing (has no `familyId`, `avatar`, or `name`).
- `student1` and `testparent@example.com` are used for features testing. Do not include users created by the tests (e.g. `student_user123`, `dinopr@gmail.com`).

### 3.1 Academic Terms (`academicterms`)

```json
[
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8ba9" },
    "name": "Term 1",
    "year": 2026,
    "term": "semester1",
    "startDate": { "$date": "2026-04-29T17:00:00.000Z" },
    "endDate": { "$date": "2026-05-31T17:00:00.000Z" },
    "isActive": true
  }
]
```

### 4. Topics (`topics`)

```json
[
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b97" },
    "title": "Các phép tính với số có 2 chữ số",
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_1_kbz1s9.svg",
    "level": 1,
    "gradeId": { "$oid": "69097372174a26d707e30173" },
    "termId": { "$oid": "60d5ec9af682fbd39a1b8ba9" },
    "isPremium": false
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b99" },
    "title": "Hình học cơ bản",
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_1_kbz1s9.svg",
    "level": 1,
    "gradeId": { "$oid": "69097372174a26d707e30173" },
    "termId": { "$oid": "60d5ec9af682fbd39a1b8ba9" },
    "isPremium": false
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b9a" },
    "title": "Dạng toán tìm x",
    "description": "https://res.cloudinary.com/dirr7ovdh/image/upload/v1761646781/grade_1_kbz1s9.svg",
    "level": 1,
    "gradeId": { "$oid": "69097372174a26d707e30173" },
    "termId": { "$oid": "60d5ec9af682fbd39a1b8ba9" },
    "isPremium": false
  }
]
```

### 5. Lectures (`lectures`)

```json
[
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b98" },
    "title": "Cộng trừ số có 2 chữ số (không nhớ)",
    "contentType": "knowledge",
    "topicId": { "$oid": "60d5ec9af682fbd39a1b8b97" },
    "status": "active"
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b9b" },
    "title": "Cộng trừ số có 2 chữ số (có nhớ)",
    "contentType": "knowledge",
    "topicId": { "$oid": "60d5ec9af682fbd39a1b8b97" },
    "status": "active"
  },
  {
    "_id": { "$oid": "60d5ec9af682fbd39a1b8b9c" },
    "title": "Nhân chia số có 2 chữ số",
    "contentType": "knowledge",
    "topicId": { "$oid": "60d5ec9af682fbd39a1b8b97" },
    "status": "active"
  }
]
```

### 6. Assessments (`assessments`) & Arenas (`arenas`)

```json
// assessments
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8ba1"},
    "title": "Entrance Test",
    "gradeId": {"$oid": "69097372174a26d707e30173"},
    "published": true
  }
]

// arenas
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8ba2"},
    "title": "Weekly Arena",
    "period": "weekly",
    "startTime": { "$date": "2026-04-29T17:00:00.000Z" },
    "endTime": { "$date": "2026-05-31T17:00:00.000Z" },
    "isActive": true,
    "gradeId": {"$oid": "69097372174a26d707e30173"}
  }
]
```
