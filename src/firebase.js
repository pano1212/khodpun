import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCDosb0NWdOL3Vn9aAc46mpQzouQgZWNAE",
  authDomain: "snakegame-2be64.firebaseapp.com",
  projectId: "snakegame-2be64",
  storageBucket: "snakegame-2be64.firebasestorage.app",
  messagingSenderId: "6309260916",
  appId: "1:6309260916:web:f20194eac8801e3ec86b21",
  measurementId: "G-TMW3NLT9BE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// ============================================
// USER POINTS FUNCTIONS
// ============================================

/**
 * Get user points by user ID (from leaderboard collection)
 * @param {string} userId - The document ID from leaderboard collection
 * @returns {Promise<number|null>} - Returns user's score or null if not found
 */
export const getUserPoints = async (userId) => {
  try {
    const userRef = doc(db, 'leaderboard', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data().score || 0;
    } else {
      console.warn(`User ${userId} not found in leaderboard`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user points:', error);
    return null;
  }
};

/**
 * Get user points by auth UID (if you're storing user data with auth UID as document ID)
 * @param {string} authUid - Firebase Auth user UID
 * @returns {Promise<number|null>} - Returns user's score or null if not found
 */
export const getUserPointsByAuthUid = async (authUid) => {
  try {
    const q = query(
      collection(db, 'leaderboard'),
      where('uid', '==', authUid)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData.score || 0;
    } else {
      console.warn(`User with auth UID ${authUid} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user points by auth UID:', error);
    return null;
  }
};

/**
 * Get full user data by user ID
 * @param {string} userId - The document ID from leaderboard collection
 * @returns {Promise<Object|null>} - Returns user data object or null if not found
 */
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'leaderboard', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.warn(`User ${userId} not found`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
