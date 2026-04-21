# Daily Planner App

Daily Planner App is a React Native (Expo + TypeScript) app with local authentication, persistent task management, and Redux state handling.

<img width="781" height="40" alt="1" src="https://github.com/user-attachments/assets/54c96b6c-6717-4c0f-8b8c-c1a601606b8a" />
<img width="783" height="40" alt="2" src="https://github.com/user-attachments/assets/c6edbccc-1912-473a-9726-cc415a356bfd" />
<img width="777" height="40" alt="3" src="https://github.com/user-attachments/assets/3a98e1de-92e1-4116-8d47-0999e920beb2" />
<img width="779" height="40" alt="4" src="https://github.com/user-attachments/assets/31f80504-3d72-4cff-97cb-6a5dcb7a52ad" />
<img width="775" height="40" alt="5" src="https://github.com/user-attachments/assets/eb151dc7-2d64-4f3f-a14d-2b70289a7481" />

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
