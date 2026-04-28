# Data Seeding Plan & JSON

This plan details the minimal data required to seed the database to satisfy all scenarios in the `e2e` tests. Based on `schemas.puml`, we have reduced the data to the absolute minimum needed. 
You can use the JSON blocks below to directly insert into MongoDB.

## Optimization Strategy
- **Minimal Users**: Only users explicitly tested (1 Student with data, 1 Parent, 1 Admin, 1 Reset User, 1 New Student for onboarding).
- **Shared Entities**: Use a single active Arena, Assessment, Topic, and Lecture.
- **Specific Exercises**: For the `e2e/assessment-arena.spec.ts` test, we ensure exactly 5 exercises with specific types for the Arena, and 1 for the Assessment.

---

### 1. Families (`families`)
```json
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b90"},
    "name": "Test Family",
    "inviteCode": "INVITE123",
    "inviteSingleUse": false
  }
]
```

### 2. Grades (`grades`)
```json
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b9f"},
    "name": "Grade 1",
    "level": 1,
    "description": "First Grade"
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b92"},
    "name": "Grade 2",
    "level": 2,
    "description": "Second Grade"
  }
]
```

### 3. Users (`users`)
```json
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b91"},
    "username": "student_user123",
    "password": "$2b$10$YourHashedPasswordFor_P@ssw0rd2026!",
    "role": "student",
    "status": "active",
    "familyId": {"$oid": "60d5ec9af682fbd39a1b8b90"},
    "gradeId": {"$oid": "60d5ec9af682fbd39a1b8b92"}
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b93"},
    "email": "testparent@example.com",
    "password": "$2b$10$YourHashedPasswordFor_Parent1@",
    "role": "parent",
    "status": "active",
    "familyId": {"$oid": "60d5ec9af682fbd39a1b8b90"}
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b94"},
    "email": "admin@dino.com",
    "password": "$2b$10$YourHashedPasswordFor_admin@123",
    "role": "admin",
    "status": "active"
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b95"},
    "username": "reset_user",
    "password": "$2b$10$YourHashedPasswordFor_OldPassword@1",
    "role": "student",
    "status": "active",
    "resetPasswordToken": "123456",
    "resetPasswordExpires": {"$date": "2026-12-31T23:59:59Z"}
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b96"},
    "username": "new_student1",
    "password": "$2b$10$YourHashedPasswordFor_NewStudent1@",
    "role": "student",
    "status": "active"
  }
]
```

### 4. Topics (`topics`)
```json
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b97"},
    "title": "Các phép tính với số có 2 chữ số",
    "description": "Topic for milestones testing",
    "level": 1,
    "gradeId": {"$oid": "60d5ec9af682fbd39a1b8b92"},
    "isPremium": false
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b99"},
    "title": "Hình học cơ bản",
    "description": "Basic geometry",
    "level": 1,
    "gradeId": {"$oid": "60d5ec9af682fbd39a1b8b92"},
    "isPremium": false
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b9a"},
    "title": "Dạng toán tìm x",
    "description": "Finding x",
    "level": 1,
    "gradeId": {"$oid": "60d5ec9af682fbd39a1b8b92"},
    "isPremium": false
  }
]
```

### 5. Lectures (`lectures`)
```json
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b98"},
    "title": "Cộng trừ số có 2 chữ số (không nhớ)",
    "contentType": "knowledge",
    "topicId": {"$oid": "60d5ec9af682fbd39a1b8b97"},
    "status": "active"
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b9b"},
    "title": "Cộng trừ số có 2 chữ số (có nhớ)",
    "contentType": "knowledge",
    "topicId": {"$oid": "60d5ec9af682fbd39a1b8b97"},
    "status": "active"
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8b9c"},
    "title": "Nhân chia số có 2 chữ số",
    "contentType": "knowledge",
    "topicId": {"$oid": "60d5ec9af682fbd39a1b8b97"},
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
    "gradeId": {"$oid": "60d5ec9af682fbd39a1b8b92"},
    "published": true
  }
]

// arenas
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8ba2"},
    "title": "Weekly Arena",
    "period": "weekly",
    "isActive": true,
    "gradeId": {"$oid": "60d5ec9af682fbd39a1b8b92"}
  }
]
```

### 7. Exercises (`exercises`)
**Note on Structure**: For mixed types and Objects (like `options`, `pairs`, `metadata`, `content`), their exact schema isn't fully defined. Based on the tests in `e2e/assessment-arena.spec.ts`:
- We need **1 exercise** for the **Assessment** (Entrance test) so the student can click 'NỘP BÀI' (Submit) and confirm. We use `type: "choice"`.
- We need **5 exercises** for the **Arena** to cover the interactive flows. The types must be in this specific order:
  1. `choice` (Multiple Choice)
  2. `true_false` (True / False)
  3. `fill_in` (Fill in the blank)
  4. `matching` (Matching pairs)
  5. `interactive` (Drag & Drop or similar interactive blank)
  
You only need to supply enough valid `options` or `pairs` JSON structure to render the options the tests expect (e.g., at least one option to click).

```json
[
  // 1 Assessment Exercise
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bb1"},
    "category": "assessment",
    "type": "choice",
    "assessmentId": {"$oid": "60d5ec9af682fbd39a1b8ba1"},
    "question": "Assessment Question 1",
    "order": 1
  },
  
  // 5 Arena Exercises
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bb2"},
    "category": "arena",
    "type": "choice",
    "arenaId": {"$oid": "60d5ec9af682fbd39a1b8ba2"},
    "question": "Arena Question 1 (Multiple Choice)",
    "order": 1
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bb3"},
    "category": "arena",
    "type": "true_false",
    "arenaId": {"$oid": "60d5ec9af682fbd39a1b8ba2"},
    "question": "Arena Question 2 (True/False)",
    "order": 2
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bb4"},
    "category": "arena",
    "type": "fill_in",
    "arenaId": {"$oid": "60d5ec9af682fbd39a1b8ba2"},
    "question": "Arena Question 3 (Fill In)",
    "order": 3
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bb5"},
    "category": "arena",
    "type": "matching",
    "arenaId": {"$oid": "60d5ec9af682fbd39a1b8ba2"},
    "question": "Arena Question 4 (Matching)",
    "order": 4
  },
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bb6"},
    "category": "arena",
    "type": "interactive",
    "arenaId": {"$oid": "60d5ec9af682fbd39a1b8ba2"},
    "question": "Arena Question 5 (Interactive)",
    "order": 5
  }
]
```

### 8. MiniGames (`minigames`)
```json
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bc1"},
    "title": "Math Quiz Challenge",
    "isActive": true
  }
]
```

### 9. Missions (`missions`) & Achievements (`achievements`)
```json
// missions
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bc2"},
    "title": "Daily Login",
    "unitType": "daily_login",
    "isActive": true
  }
]

// achievements
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bc3"},
    "userId": {"$oid": "60d5ec9af682fbd39a1b8b91"},
    "missionId": {"$oid": "60d5ec9af682fbd39a1b8bc2"},
    "finished": true,
    "claimed": false
  }
]
```

### 10. Progress (`progresses`) & Results
```json
// progresses
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bc4"},
    "userId": {"$oid": "60d5ec9af682fbd39a1b8b91"},
    "lectureId": {"$oid": "60d5ec9af682fbd39a1b8b98"},
    "status": "completed"
  }
]

// lectureresults
[
  {
    "_id": {"$oid": "60d5ec9af682fbd39a1b8bc5"},
    "userId": {"$oid": "60d5ec9af682fbd39a1b8b91"},
    "lectureId": {"$oid": "60d5ec9af682fbd39a1b8b98"},
    "status": "pass"
  }
]
```
