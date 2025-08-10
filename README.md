# MonaApp - React Native Financial Analysis Chat App

A React Native mobile application that provides financial analysis through an AI chat interface. The app features a login page and a chatroom where users can interact with "Mona" to get financial reports and analysis.

## Features

- **Login/Create Account Screen**: Clean form with email, business name, and password fields
- **Chat Interface**: Interactive chat with AI assistant "Mona"
- **Financial Reports**: Display of cash flow and operational reports
- **Interactive Cards**: Preview, download, and share functionality for reports
- **Modern UI**: Clean design with green accent colors matching the original design

## Screenshots

The app includes two main screens:
1. **Login Screen**: Create account form with password strength indicator
2. **Chatroom Screen**: Chat interface with financial analysis results

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS) or Android Emulator (for Android)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Expo CLI globally (if not already installed):**
   ```bash
   npm install -g @expo/cli
   ```

## Running the App

1. **Start the development server:**
   ```bash
   npm start
   ```

2. **Run on iOS:**
   ```bash
   npm run ios
   ```

3. **Run on Android:**
   ```bash
   npm run android
   ```

4. **Run on Web:**
   ```bash
   npm run web
   ```

## Project Structure

```
monaapp/
├── App.js                 # Main app component with navigation
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── src/
│   └── screens/
│       ├── LoginScreen.js    # Login/Create account screen
│       └── ChatroomScreen.js # Chat interface screen
└── README.md             # This file
```

## Navigation Flow

1. **Login Screen** → User fills in email, business name, and password
2. **Create Account Button** → Navigates to Chatroom
3. **Login Link** → Also navigates to Chatroom (for existing users)
4. **Chatroom Screen** → Displays financial analysis results and chat interface

## Key Features Implemented

### Login Screen
- Email, business name, and password input fields
- Password visibility toggle
- Password strength indicator
- Pre-filled sample data
- Navigation to chatroom

### Chatroom Screen
- Header with menu button and title
- Success message bubble
- Analysis message bubble
- Interactive report cards with:
  - Cash Flow Report
  - Operational Report
  - Preview, Download, and Share buttons
- Bottom input bar with:
  - Grid button
  - Text input for questions
  - Upload button
  - Send button

## Styling

The app uses a consistent color scheme:
- Primary Green: `#4CAF50`
- Background: `#ffffff`
- Text: `#333333`
- Secondary Text: `#666666`
- Borders: `#f0f0f0`

## Dependencies

- **React Navigation**: For screen navigation
- **Expo**: For development and building
- **React Native Vector Icons**: For icons (Ionicons)
- **React Native Safe Area Context**: For safe area handling
- **React Native Gesture Handler**: For touch interactions

## Development Notes

- The app is built using Expo for easier development and deployment
- All text is in Indonesian to match the original design
- The UI closely follows the uploaded design images
- Interactive elements are properly implemented with touch handlers
- The app is responsive and works on both iOS and Android

## Next Steps

To enhance the app further, consider adding:
- Backend integration for real authentication
- File upload functionality
- Real-time chat features
- Push notifications
- Offline support
- More financial report types 