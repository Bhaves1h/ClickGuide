// js/firebase-config.js
// Firebase Web App Configuration
// ==============================================================================
// REPLACE THE PLACEHOLDERS BELOW WITH YOUR ACTUAL FIREBASE PROJECT CONFIGURATION:
// Found in Firebase Console (https://console.firebase.google.com/):
// Project Overview -> Project settings -> General -> "Your apps" -> Web app (</>)
// ==============================================================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

if (typeof window !== "undefined") {
  window.firebaseConfig = firebaseConfig;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = firebaseConfig;
}
