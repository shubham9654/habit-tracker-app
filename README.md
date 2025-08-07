# Habit Tracker App

A cross-platform mobile application built with Expo (React Native) to help users track and maintain daily habits.

## Features

- Add and manage daily habits (e.g., workout, drink water, read)
- Track progress with daily checkboxes
- View habit streaks and completion history
- Set daily habit reminders with notifications
- Motivational quotes to keep you inspired
- Clean, minimal UI suitable for both Android and iOS
- Offline functionality with local data storage
- Smooth animations for a polished user experience

## Screenshots

(Screenshots will be added after the first run)

## Technologies Used

- React Native / Expo
- TypeScript
- React Navigation
- AsyncStorage for local data persistence
- Expo Notifications for reminders

## Getting Started

### Prerequisites

- Node.js (v12 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac users) or Android Emulator / Physical device

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/habit-tracker.git
   cd habit-tracker
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```
   npm start
   # or
   yarn start
   ```

4. Run on a device or emulator
   - Press `a` to run on Android
   - Press `i` to run on iOS (Mac only)
   - Or scan the QR code with the Expo Go app on your physical device

## Usage

1. **Home Screen**: View today's habits and overall progress
2. **Add Habit**: Create new habits with customizable frequency, color, and reminders
3. **Habit Details**: View streak information and completion history
4. **All Habits**: See all your habits in one place

## Project Structure

```
src/
├── assets/         # Images and other static assets
├── components/     # Reusable UI components
├── contexts/       # React Context for state management
├── navigation/     # Navigation configuration
├── screens/        # App screens
└── utils/          # Utility functions and helpers
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various habit tracking apps and productivity techniques
- Built with Expo and React Native