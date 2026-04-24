# End-to-end Test Plan

## Application Overview

End-to-end test plan for the Dino Next.js frontend covering primary user journeys, error cases, and critical flows. Assume a fresh browser state for each scenario unless noted. Tests are organized so they can run independently.

## Test Scenarios

### 1. Authentication

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Login — happy path

**File:** `specs/auth-login.md`

**Steps:**
  1. Open the site and navigate to the Login page
    - expect: Login page is displayed with email and password fields and a submit button
  2. Enter valid credentials and submit
    - expect: User is authenticated, redirected to the dashboard/home, user avatar or name visible

#### 1.2. Login — invalid credentials

**File:** `specs/auth-login-invalid.md`

**Steps:**
  1. Open Login page, enter incorrect password, submit
    - expect: An inline error message appears (invalid credentials) and user remains on Login page

#### 1.3. Signup — happy path

**File:** `specs/auth-signup.md`

**Steps:**
  1. Open Signup/Registration page, fill required fields and submit
    - expect: Registration succeeds, confirmation message shown, user optionally redirected to onboarding or logged in

#### 1.4. Password reset

**File:** `specs/auth-reset.md`

**Steps:**
  1. On Login page click 'Forgot password', submit a registered email
    - expect: A confirmation that reset email was sent is displayed; reset flow reachable via emailed link (if testable)

### 2. Onboarding

**Seed:** `e2e/seed.spec.ts`

#### 2.1. Complete onboarding flow

**File:** `specs/onboarding-complete.md`

**Steps:**
  1. Start onboarding after first login, follow onboarding screens and complete required questions
    - expect: Onboarding completes, user taken to main dashboard, onboarding flag cleared in UI

#### 2.2. Skip onboarding

**File:** `specs/onboarding-skip.md`

**Steps:**
  1. Choose 'Skip' on onboarding intro
    - expect: Onboarding is skipped and user lands on main dashboard; skip persists for session

### 3. Navigation & Layout

**Seed:** `e2e/seed.spec.ts`

#### 3.1. Main navigation (desktop)

**File:** `specs/nav-desktop.md`

**Steps:**
  1. From homepage, open each top navigation item (Home, Study, Games, Arena, Leaderboard, Profile)
    - expect: Each route loads, main header and breadcrumbs update appropriately, active nav item highlighted

#### 3.2. Responsive menu (mobile)

**File:** `specs/nav-mobile.md`

**Steps:**
  1. Switch to narrow viewport, open mobile menu and navigate to Study and Games
    - expect: Mobile menu opens, items visible, navigation works and layout adapts to mobile

### 4. Exercises & Study

**Seed:** `e2e/seed.spec.ts`

#### 4.1. Open exercise — Multiple Choice

**File:** `specs/exercise-mc.md`

**Steps:**
  1. Navigate to a study module, open a multiple-choice exercise
    - expect: Question and choices render, submit button enabled
  2. Select correct answer and submit
    - expect: Success feedback shown, score updated or progression advances

#### 4.2. Submit incorrect answer — shows explanation

**File:** `specs/exercise-incorrect.md`

**Steps:**
  1. Submit an incorrect answer
    - expect: Inline feedback shows incorrect state and 'Explain' or solution modal is available

#### 4.3. Fill-in and Matching interactions

**File:** `specs/exercise-interactive.md`

**Steps:**
  1. Open FillIn and Matching exercise types and interact with draggable/typed inputs
    - expect: Inputs accept entries, validation works, interaction is smooth without JS errors

#### 4.4. Exercise state persistence

**File:** `specs/exercise-persistence.md`

**Steps:**
  1. Start an exercise, leave the page, return to the exercise
    - expect: Progress is persisted or user prompted to resume depending on UX spec

### 5. Games & Minigames

**Seed:** `e2e/seed.spec.ts`

#### 5.1. Load game canvas (Cocos)

**File:** `specs/game-load.md`

**Steps:**
  1. Navigate to a game page that loads Cocos canvas
    - expect: Game engine loads, canvas is visible, no console errors from engine files

#### 5.2. Start and complete minigame/level

**File:** `specs/game-play.md`

**Steps:**
  1. Start a minigame and play through one level following on-screen instructions
    - expect: Level runs, completion triggers success state and rewards/progression applied

#### 5.3. Game pause/resume and audio controls

**File:** `specs/game-audio.md`

**Steps:**
  1. During gameplay use pause and volume controls
    - expect: Game pauses, resume works, volume toggles affect audio output

#### 5.4. Save/Load game progress

**File:** `specs/game-save.md`

**Steps:**
  1. Play to a save point, reload the page or re-login
    - expect: Saved progress restored or cloud save notice shown according to spec

### 6. Profile & Account

**Seed:** `e2e/seed.spec.ts`

#### 6.1. View profile and account details

**File:** `specs/profile-view.md`

**Steps:**
  1. Open Profile page
    - expect: User details (name, email, avatar) are displayed and correct

#### 6.2. Edit profile — update name and avatar

**File:** `specs/profile-edit.md`

**Steps:**
  1. Edit display name and upload/change avatar, save changes
    - expect: Changes persist, profile shows updated name/avatar, API returns success

#### 6.3. Change password flow

**File:** `specs/profile-password.md`

**Steps:**
  1. Change password from account settings with valid current password
    - expect: Password changed confirmation shown; old password no longer valid for login

#### 6.4. Subscription/Upgrade (upgrade tab)

**File:** `specs/profile-upgrade.md`

**Steps:**
  1. Open Upgrade tab, select subscription and proceed to checkout
    - expect: Payment UI opens, selected plan summary visible before payment

### 7. Payments & Purchase

**Seed:** `e2e/seed.spec.ts`

#### 7.1. Successful payment flow (happy path)

**File:** `specs/payment-success.md`

**Steps:**
  1. Start purchase for subscription or item, enter valid card/test card details and confirm
    - expect: Payment succeeds, user receives confirmation, subscription active or item delivered

#### 7.2. Failed payment handling

**File:** `specs/payment-fail.md`

**Steps:**
  1. Attempt payment with declined card details
    - expect: Clear error shown (card declined), payment not applied, user can retry

#### 7.3. Payment page validation

**File:** `specs/payment-validation.md`

**Steps:**
  1. Submit payment form with missing/invalid required fields
    - expect: Inline validation messages appear and submission blocked until fixed

### 8. Missions & World

**Seed:** `e2e/seed.spec.ts`

#### 8.1. View available missions

**File:** `specs/missions-view.md`

**Steps:**
  1. Open Missions section
    - expect: List of missions loads with progress indicators and start buttons

#### 8.2. Start and complete a mission

**File:** `specs/missions-complete.md`

**Steps:**
  1. Start a mission, complete required steps in mission tasks
    - expect: Mission progress updates and mission completes with reward and updated UI

#### 8.3. Mission failure/retry

**File:** `specs/missions-retry.md`

**Steps:**
  1. Fail a mission (if possible) and choose retry
    - expect: Failure state displayed and retry restarts mission without corrupting state

### 9. Leaderboard & Arena

**Seed:** `e2e/seed.spec.ts`

#### 9.1. View leaderboard and filters

**File:** `specs/leaderboard.md`

**Steps:**
  1. Open Leaderboard, apply filters (global, friends, weekly)
    - expect: Filtered results update accordingly and ranks are correct format

#### 9.2. Join Arena — matchmaking flow

**File:** `specs/arena-join.md`

**Steps:**
  1. Enter Arena queue or challenge a player
    - expect: Matchmaking engages, match found notification or waiting state shown

#### 9.3. Arena match flow

**File:** `specs/arena-match.md`

**Steps:**
  1. Complete a short arena match, observe win/lose and leaderboard update
    - expect: Match result recorded, player stats update on leaderboard and match summary shown

### 10. Accessibility & Performance

**Seed:** `e2e/seed.spec.ts`

#### 10.1. Keyboard navigation and focus order

**File:** `specs/accessibility-keyboard.md`

**Steps:**
  1. Tab through main pages and interactive controls using keyboard only
    - expect: Focusable elements are reachable in logical order and actionable via Enter/Space

#### 10.2. Screen-reader labels and ARIA presence

**File:** `specs/accessibility-aria.md`

**Steps:**
  1. Inspect pages with accessibility tree/tools for key pages
    - expect: Buttons, forms and images have visible accessible names or ARIA labels

#### 10.3. Basic performance check

**File:** `specs/performance.md`

**Steps:**
  1. Load main pages (Home, Study, Game) on cold load
    - expect: Pages render without blocking JS errors; essential content visible within acceptable timeframe
