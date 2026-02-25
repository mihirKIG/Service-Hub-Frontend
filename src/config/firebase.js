// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
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
