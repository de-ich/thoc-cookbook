# THOC Cookbook

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## THOC Cookbook @ Firebase

- [https://console.firebase.google.com/project/thoc-cookbook/overview](https://console.firebase.google.com/project/thoc-cookbook/overview)

## Initialize Firebase CLI

- Install Firebase CLI via `npm install -g firebase-tools` (see [https://firebase.google.com/docs/cli?hl=de#install_the_firebase_cli](https://firebase.google.com/docs/cli?hl=de#install_the_firebase_cli))
- Try installation succeeded via `firebase`
- In case the script is not executed due to a security rule, just delete the 'firebase.ps1' file (see [https://stackoverflow.com/a/68240534](https://stackoverflow.com/a/68240534))
- Login to firebase via `firebase login`
- Enable experimental webframeworks via `firebase experiments:enable webframeworks`

## Using the Firebase Emulators for local Testing

- `firebase emulators:start`

## Deploy Firebase Hosting

- `firebase deploy --only hosting`
