# Data Seeding Plan

This plan details the minimal data required to seed the database to satisfy all scenarios in `complete_testcases.md`. Based on `Dino_Math_Erd.puml`, certain collections are excluded by request (`grades`, `worlds`, `lands`, `ranks`, `topics`, `academicterms`), assuming these are either pre-seeded or statically configured.

## Optimization Strategy
- **Minimal Users**: Create 1 Family with 1 Parent and 2 Students (one with data, one without).
- **Shared Entities**: Use a single active Arena, Assessment, and MiniGame to test multiple scenarios.
- **Progress Tracking**: Seed exact states for `not_started` and `completed` lectures to test different logic branches.

---

## Collections to Seed

### 1. Families (`Family`)
- **Quantity**: 1
- **Data**: 
  - `_id`: `family1`
  - `name`: "Test Family"
  - `inviteCode`: "INVITE123"

### 2. Users (`User`)
- **Quantity**: 4
- **Data**:
  1. **Student 1 (Has Data)**: `_id: student1`, `role: student`, `familyId: family1`, `username: student1`, `password: Student1@rcv`, `gradeId: grade1` (assumed).
  2. **Student 2 (No Data)**: `_id: student2`, `role: student`, `familyId: family1`, `username: student2_nodata`, `password: Student2@rcv`.
  3. **Parent**: `_id: parent1`, `role: parent`, `familyId: family1`, `email: testparent@example.com`, `password: Parent1@`.
  4. **Admin (Login Blocked)**: `_id: admin1`, `role: admin`, `email: admin@dino.com`, `password: admin@123`.
  5. *(Implicit Google Parent)*: Needs Google auth setup for `testpr@gmail.com`.
  6. **Reset User**: `_id: reset_user1`, `role: student`, `username: reset_user`, `password: OldPassword@1`, `resetPasswordToken: "123456"`, `resetPasswordExpires: "2026-12-31T23:59:59Z"`.
  7. **New Student 1 (Onboarding)**: `_id: new_student1`, `role: student`, `username: new_student1`, `password: NewStudent1@`, `familyId: null`, `gradeId: null`.
  8. **New Student 2 (Onboarding)**: `_id: new_student2`, `role: student`, `username: new_student2`, `password: NewStudent2@`, `familyId: null`, `gradeId: null`.

### 3. Lectures (`Lecture`)
- **Quantity**: 2 (to simulate missing/available data and progress)
- **Data**:
  1. `_id: lecture1`, `topicId: topic1` (assumed), `status: active`.
  2. `_id: lecture2`, `topicId: topic1`, `status: inactive`.

### 4. Exercises (`Exercise`)
- **Quantity**: 3
- **Data**:
  1. **Assessment Exercise**: `_id: ex1`, `category: assessment`, `assessmentId: assessment1`, `correctAnswer: "A"`.
  2. **Arena Exercise**: `_id: ex2`, `category: arena`, `arenaId: arena1`, `correctAnswer: "2"`.
  3. **Lecture Exercise**: `_id: ex3`, `category: lecture`, `lectureId: lecture1`, `correctAnswer: "1"`.

### 5. Progress (`Progress`)
- **Quantity**: 2
- **Data**:
  1. `userId: student1`, `lectureId: lecture1`, `status: not_started`.
  2. `userId: student1`, `lectureId: lecture2`, `status: completed`.

### 6. Lecture Results (`LectureResult`)
- **Quantity**: 1 (For History/Dashboard testing)
- **Data**: 
  - `userId: student1`, `lectureId: lecture2`, `status: pass`, `finishedAt: "2024-06-01T10:00:00Z"`, `metadata.topicTitle: "Math"`.

### 7. Missions & Achievements (`Mission`, `Achievement`)
- **Quantity**: 2 Missions, 2 Achievements
- **Data**:
  1. **Mission 1**: `_id: mission_login`, `unitType: daily_login`.
     **Achievement 1**: `userId: student1`, `missionId: mission_login`, `finished: true`, `claimed: false`.
  2. **Mission 2**: `_id: mission_lecture`, `unitType: lecture`.
     **Achievement 2**: `userId: student1`, `missionId: mission_lecture`, `finished: true`, `claimed: false`.

### 8. Assessments (`Assessment`, `AssessmentResult`)
- **Quantity**: 1 Assessment, 1 Result
- **Data**:
  1. **Assessment**: `_id: assessment1`, `gradeId: grade1` (assumed), `published: true`, `title: "Assessment 1"`.
  2. **Result**: `userId: student1`, `assessmentId: assessment1`, `status: in_progress`, `createdAt: "2024-05-01T10:00:00Z"`.

### 9. Arenas (`Arena`, `Participation`)
- **Quantity**: 1 Arena, 1 Participation
- **Data**:
  1. **Arena**: `_id: arena1`, `gradeId: grade1` (assumed), `isActive: true`.
  2. **Participation**: `userId: student1`, `arenaId: arena1`, `status: finished`, `finishedAt: "2024-07-01T10:00:00Z"`.

### 10. MiniGames (`MiniGame`)
- **Quantity**: 1
- **Data**:
  1. `_id: game1`, `title: "Math Quiz Challenge"`, `isActive: true`.
