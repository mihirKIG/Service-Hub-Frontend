// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBA5D0-_CfRqU5yNO_GGupnZhG7t_UeJu0",
  authDomain: "service-hub-9a13c.firebaseapp.com",
  projectId: "service-hub-9a13c",
  storageBucket: "service-hub-9a13c.firebasestorage.app",
  messagingSenderId: "774160326672",
  appId: "1:774160326672:web:4784e6cd3c0867bbb02a95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Sign in with Google popup (with better error handling)
export const signInWithGoogle = async () => {
  try {
    console.log("🔵 Opening Google popup...");

    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);

    // Get Firebase ID Token
    const idToken = await result.user.getIdToken(true);

    console.log("✅ Google popup success, token received");

    return {
      success: true,
      user: result.user,
      token: idToken,
    };
  } catch (error) {
    console.error("❌ Firebase Google Sign-In Error:", error.code, error.message);
    
    // If popup was closed by user, provide helpful message
    if (error.code === 'auth/popup-closed-by-user') {
      return {
        success: false,
        error: 'Sign-in cancelled. Please try again.',
        code: error.code
      };
    }
    
    // If popup blocked, suggest using redirect
    if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: 'Popup blocked by browser. Please allow popups and try again.',
        code: error.code
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to sign in with Google',
      code: error.code
    };
  }
};

// Check for redirect result on page load
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const idToken = await result.user.getIdToken(true);
      return {
        success: true,
        user: result.user,
        token: idToken,
      };
    }
    return null;
  } catch (error) {
    console.error("❌ Redirect result error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
