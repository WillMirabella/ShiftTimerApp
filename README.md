# Shift Timer

A simple personal timer app:

- One Start/Stop button. Start begins a timer, Stop ends it.
- A progress bar fills as time passes, scaled to a 12-hour range:
  - **Green** for the first 8 hours
  - **Yellow** from 8-10 hours
  - **Red** from 10 hours onward (bar holds full past 12 hours)
- The timer survives closing/reopening the app or restarting the phone (it's based on the actual start timestamp, not a running counter).
- A history list shows every completed session from the past 7 days (older ones drop off automatically).

## Requirements

- [Node.js](https://nodejs.org/) 20.19+ (or any newer LTS) and npm.
- A phone or emulator to test on, and eventually an Android phone to install the built APK on.

## Running it during development

```
npm install
npm run android   # or: npm run web, to preview in a browser
```

The easiest way to try it live on a phone without building anything is the **Expo Go** app:
1. Install "Expo Go" from the Play Store on the phone.
2. Run `npm start` on your computer.
3. Scan the QR code shown in the terminal with Expo Go.

This requires your computer's dev server to keep running, so it's only good for quick testing — not for daily real use.

## Building a real, standalone APK to install (sideload)

This produces a normal installable app that runs on its own, no dev server needed.

### Option A: EAS Build (cloud, free tier)

1. `npm install -g eas-cli` (or use `npx eas-cli`)
2. `npx eas login` (free Expo account)
3. `npx eas build -p android --profile preview`
4. When the build finishes, it gives you a download link/QR code for the `.apk` file. Download it onto the phone.

If there's no `eas.json` yet, running `npx eas build` for the first time will offer to create one — accept the defaults for an APK ("preview"/internal distribution), not an `.aab` (Play Store bundle).

### Option B: Local build (no cloud account needed)

1. Install [Android Studio](https://developer.android.com/studio) and let it set up the Android SDK.
2. Run:
   ```
   npx expo prebuild -p android
   npx expo run:android --variant release
   ```
3. The APK will be at `android/app/build/outputs/apk/release/app-release.apk`.

### Installing the APK on the phone

1. Copy the `.apk` file onto the phone (USB transfer, email, cloud drive, etc.).
2. Tap the file in a file manager. Android will prompt to allow installs from that source ("Install unknown apps") — allow it.
3. Install and open like any other app.

## Project structure

```
App.tsx                        - root screen (title, timer, history)
src/
  storage.ts                    - AsyncStorage persistence (active session + 7-day history)
  utils/time.ts                 - formatting + color/progress threshold logic
  hooks/useTimer.ts              - start/stop timer state, ticking, persistence
  components/ProgressBar.tsx     - the colored progress bar
  components/TimerDisplay.tsx    - clock readout + Start/Stop button
  components/HistoryList.tsx     - past 7 days list
```
