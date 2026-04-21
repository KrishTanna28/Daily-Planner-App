# Daily Planner App

Daily Planner App is a React Native (Expo + TypeScript) app with local authentication, persistent task management, and Redux state handling.

## Tech Stack

- Expo + React Native
- TypeScript
- Redux Toolkit + React Redux
- React Navigation (Native Stack)
- AsyncStorage for persistence
- Vitest for unit tests

## Implemented Features

### Authentication

- Register with validation:
	- Full name required
	- Email format validation
	- Password minimum 6 characters
	- Confirm password must match
- Login with credential checks against stored users
- Persistent session restore on app launch
- Logout clears session from Redux and AsyncStorage

### Dashboard and Tasks

- Personalized greeting from Redux session state
- Current date display
- Task CRUD with AsyncStorage persistence per logged-in user
- Task status toggle (Pending/Completed)
- Filter by All, Pending, Completed
- Search tasks by title/description

### Daily Reset

- Checks date at startup and when app returns to foreground
- Automatically clears previous-day tasks when day changes
- Shows dismissible in-app notice when reset is applied

## Project Structure

```text
src/
	components/
		layout/
		ui/
	constants/
	navigation/
	redux/
		slices/
	screens/
		auth/
		app/
	services/
	theme/
	types/
	utils/
```

## Development Commands

```bash
npm install
npm run start
```

### Quality Checks

```bash
npm run typecheck
npm run test:unit
```

## Evaluation Demo Checklist

1. Register a new user with valid values.
2. Try registering with the same email again and confirm duplicate-email error.
3. Login with correct credentials and verify Dashboard opens.
4. Close and reopen app, verify user remains logged in.
5. Add tasks with valid/invalid due time and verify validation.
6. Edit a task and confirm updated values persist.
7. Toggle task status and verify filters (All/Pending/Completed).
8. Search by title/description and verify live filtering.
9. Delete a task and verify persistence after restart.
10. Logout and confirm app returns to Login and does not auto-login after restart.

## Daily Reset Manual Verification

Use either approach:

1. Change device date to next day, relaunch app, and verify tasks are cleared.
2. Set `@daily-planner/last-reset-date` in storage to a previous day, relaunch, and verify reset notice appears.

## Notes

- This project is local-first and does not require a backend API.
- Passwords are currently stored in plain text for educational scope; production apps should use secure storage and hashing.