# Khodpun Project Documentation

## Project Overview
**Khodpun** is a retro arcade-themed React + Vite application featuring mini-games with Firebase integration for user authentication and leaderboard management.

---

## Technology Stack
- **Frontend Framework:** React 18.3.1 + Vite 5.4.8
- **Styling:** Tailwind CSS 3.4.14, Material-UI 7.3.2, Emotion
- **Backend/Database:** Firebase (Auth, Firestore)
- **Icons:** FontAwesome, Material-UI Icons
- **Carousel:** React Slick 0.30.2
- **Deployment:** GitHub Pages (gh-pages)
- **Code Quality:** ESLint 9.11.1

---

## Project Structure
```
/src
  ├── App.jsx                 # Main app component with screen navigation
  ├── firebase.js            # Firebase configuration & initialization
  ├── main.jsx              # React entry point
  ├── index.css             # Global styles
  ├── LoginForm.jsx         # User authentication component
  ├── SnakeGame.jsx         # Snake game component
  ├── pun.jsx               # Pun game component
  ├── components/
  │   └── leaderboard.jsx   # Leaderboard display component
  └── assets/               # Static assets
```

---

## Key Components

### App.jsx
- **Purpose:** Main application shell with screen routing
- **Screens:** Menu (default), Pun Game, Snake Game, Login
- **Features:** Retro arcade menu UI with animated buttons

### Games
- **SnakeGame.jsx:** Classic snake game implementation
- **pun.jsx:** Pun-based game/puzzle component

### Authentication & Data
- **LoginForm.jsx:** User sign-in interface (Firebase Auth)
- **leaderboard.jsx:** Displays game scores and rankings (Firestore)
- **firebase.js:** Firebase configuration for Auth & Firestore

---

## Firebase Configuration
- **Project ID:** snakegame-2be64
- **Auth:** Firebase Authentication enabled
- **Database:** Cloud Firestore for leaderboards & user scores

---

## Scripts
```json
"dev"      → npm run dev      # Start dev server (Vite HMR)
"build"    → npm run build    # Production build
"lint"     → npm run lint     # Run ESLint
"preview"  → npm run preview  # Preview production build
"deploy"   → npm run deploy   # Deploy to GitHub Pages
```

---

## Recent Changes

### May 28, 2026 - Game Over Login Prompt
**Updated `SnakeGame.jsx` with login encouragement:**
- Added props: `currentUser` and `onShowLogin` callback
- When game ends and user is NOT logged in:
  - Shows prominent yellow warning box: "⚠️ LOGIN TO SAVE YOUR SCORE ⚠️"
  - Animated button to trigger login/register form
  - Message explains benefits of creating account
- When user IS logged in:
  - Shows score submission form as before
  - Users can save their score to leaderboard

**Updated `App.jsx` with auth state:**
- Added Firebase auth state management at App level
- Passes `currentUser` to SnakeGame component
- `onShowLogin` callback navigates to login screen
- Enables auth-aware UI across all game screens

**Updated `pun.jsx`:**
- Now passes `currentUser` and `onShowLogin` callback to SnakeGame
- Login modal can be triggered from game over screen

**Flow:**
1. Game ends with score > 0
2. If user NOT logged in → Shows login prompt box
3. User clicks "LOGIN / REGISTER NOW" button
4. Login form appears
5. After successful login, user returns to game
6. Can now submit score to leaderboard

---

### May 28, 2026 - Authentication UX Improvements
**Enhanced `pun.jsx` auth modal with professional UX:**

#### Visual Design:
- Cyan-themed gradient background with glow effects
- Bold header with lightning bolt icons
- Close button (✕) for easy dismissal
- Better color contrast and visual hierarchy
- Drop shadows and retro styling consistency

#### Form Improvements:
- **Input Labels** with icons (📧 Email, 🔐 Password, ✓ Confirm)
- **Password Visibility Toggle** - Eye icon to show/hide passwords
- Focus states with green glow effects
- Enter key support (press Enter to submit)
- Better spacing and form grouping

#### Enhanced Feedback:
- **Error Messages** with visual warning box (⚠️)
- **Password Strength Indicator** (only on register):
  - Shows 3 indicators: length >= 6, length >= 10, contains number
  - Visual progress bars
  - Strength rating: Weak/Medium/Strong
- **Loading States** with animated text (⏳ CREATING..., ⏳ SIGNING IN...)

#### Better UX Elements:
- Tab buttons with emojis (🔓 LOGIN, ✚ REGISTER)
- Action buttons with icons (▶ START GAME, ✚ REGISTER NEW PLAYER)
- Disabled states prevent interaction during loading
- Form inputs styled consistently with retro theme
- Better button shadows and hover effects

#### Accessibility:
- Keyboard navigation (Enter to submit)
- Clear visual feedback for all interactions
- Better error messaging
- Form state management with field clearing

---

### May 28, 2026 - Added User Registration to Pun Game
**Updated `pun.jsx` with Firebase Registration:**
- Added user registration with `createUserWithEmailAndPassword()`
- **Tabbed interface** for switching between Login and Register modes
- Registration form includes:
  - Email field
  - Password field
  - Confirm password field
  - Validation for password match and minimum 6 characters
- Tab styling:
  - **LOGIN tab** (Yellow)
  - **REGISTER tab** (Green)
- Form validation checks:
  - All fields required
  - Passwords must match
  - Password minimum 6 characters
  - Real Firebase error messages
- After successful registration, user is automatically logged in

**Features:**
- Smooth tab switching between login and registration
- Conditional password confirmation field (only shows on register tab)
- Dynamic button label ("LOGIN" or "REGISTER")
- Loading states during authentication
- Comprehensive error handling with user-friendly messages

---

### May 28, 2026 - Firebase Sign-in in Pun Game
**Updated `pun.jsx` with Firebase Authentication:**
- Integrated Firebase email/password sign-in (`signInWithEmailAndPassword()`)
- Auto-detects logged-in users using `onAuthStateChanged()`
- **Displays user info and points in game header** when logged in:
  - Shows player email (username part)
  - Shows current points fetched from Firestore
- Login button replaced with conditional rendering:
  - Shows "LOGIN" button when not logged in
  - Shows "USER INFO" + "LOGOUT" button when logged in
- Replaced simple name input with Firebase email/password form
- Real-time error messages from Firebase authentication
- Loading states while signing in
- Logout functionality clears session and resets points display

**Features:**
- User session persists across game pages
- Points display updates automatically
- Professional Firebase error handling
- Disable inputs/buttons during authentication

---

### May 28, 2026 - User Points Fetching from Firebase
**Added Firebase utility functions to `firebase.js`:**
- `getUserPoints(userId)` - Fetches user points by document ID from leaderboard
- `getUserPointsByAuthUid(authUid)` - Fetches user points by Firebase Auth UID
- `getUserData(userId)` - Fetches complete user data (score, name, timestamp, etc.)

**Usage Example:**
```javascript
import { getUserPoints, getUserData } from './firebase';

// Get points by user ID
const points = await getUserPoints('user-doc-id');

// Get full user data
const userData = await getUserData('user-doc-id');
console.log(userData.score, userData.name);

// Get points by auth UID (requires 'uid' field in leaderboard documents)
const authPoints = await getUserPointsByAuthUid(authUid);
```

**Note:** Ensure your Firestore `leaderboard` collection documents include:
- `score` field (number)
- `name` field (string) - optional
- `uid` field (string) - optional, for auth UID mapping

---

### May 28, 2026 - Login Form with User Points Display
**Updated `LoginForm.jsx` with Firebase Authentication:**
- Real Firebase email/password login using `signInWithEmailAndPassword()`
- Auto-detects logged-in users using `onAuthStateChanged()`
- **Fetches and displays current user points on login** using the new Firebase functions
- Shows user profile card when logged in:
  - Player name (or email if name not available)
  - **Current Points** prominently displayed
  - Email address
  - Logout button
- Error handling and loading states
- Login form uses email instead of username (Firebase standard)

**Features:**
- User session persists across page reloads
- Real-time point fetching from Firestore leaderboard collection
- Supports two lookup methods:
  1. Query by UID field in leaderboard (if `uid` field exists)
  2. Direct document lookup using auth UID as document ID
- Logout functionality clears user session and form

---

### May 28, 2026 - Login Button on Game Screens
**Added LOGIN navigation buttons to game screens:**
- **SnakeGame.jsx:** Added LOGIN button in top-left alongside MENU button
  - Updated component to accept `onLogin` prop
  - LOGIN button navigates directly to login page from snake game
- **pun.jsx (Pun Game):** Updated existing LOGIN button to use `onLogin` prop
  - Now navigates to login page instead of showing local modal
- **App.jsx:** Updated route handlers to pass `onLogin` callback
  - Both game components now receive function to navigate to login

**Navigation Flow:**
```
Menu → Snake Game → LOGIN button → Login Page (with points display)
Menu → Pun Game → LOGIN button → Login Page (with points display)
```

**UI Changes:**
- SnakeGame: LOGIN button added in fixed top-left with MENU button
- Pun Game: Existing LOGIN button now navigates to login page
- Consistent purple styling for all LOGIN buttons across the app

---

## Notes
- Retro arcade theme with grid background effects
- Green terminal/CRT styling throughout UI
- Responsive design for mobile & desktop
- GitHub Pages deployment configured in package.json homepage

