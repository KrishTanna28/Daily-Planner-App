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