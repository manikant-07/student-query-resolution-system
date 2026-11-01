import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

// 1. Firebase Project Configuration (from Vite Environment Variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials have been populated with valid keys
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'YOUR_PROJECT_ID'
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    // Ensure persistent login across browser sessions & tab reloads
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Firebase persistence warning:', err);
    });
  } catch (error) {
    console.error('Failed to initialize Firebase SDK:', error);
  }
}

export { auth, db, googleProvider };

// 2. Google Authentication Provider Sign-In
export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    // Graceful fallback for local development when .env is pending configuration
    console.warn('Firebase credentials not configured. Simulating Google Sign-In for demo.');
    const demoGoogleUser = {
      uid: 'google-demo-' + Math.random().toString(36).substring(2, 9),
      displayName: 'Manikant Rajpoot',
      email: 'manikant.student@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    return {
      user: demoGoogleUser,
      isDemo: true,
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Extracted Google profile attributes
    return {
      user: {
        uid: user.uid,
        displayName: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || null,
        phoneNumber: user.phoneNumber || null,
      },
      isDemo: false,
    };
  } catch (error) {
    console.error('Firebase Google Sign-In Error:', error);
    // Provide user-friendly error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google Sign-In popup was closed before completion.');
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-In request was cancelled.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup blocked by browser. Please allow popups for this domain.');
    } else if (error.code === 'auth/unauthorized-domain') {
      throw new Error(`Domain (${window.location.hostname}) is not authorized in Firebase Console -> Authentication -> Settings -> Authorized Domains.`);
    }
    throw error;
  }
}

// 3. User Sign Out
export async function signOutFirebase() {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
}

// 4. Firestore: Fetch User Profile by UID
export async function getUserProfileFromFirestore(uid) {
  if (!isFirebaseConfigured || !db || !uid) {
    // Return cached profile if in demo mode
    try {
      const cached = localStorage.getItem(`firebase_profile_${uid}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
}

// 5. Firestore: Save or Update User Profile
export async function saveUserProfileToFirestore(uid, profileData) {
  if (!uid) return;

  const dataToSave = {
    uid,
    full_name: profileData.full_name || profileData.fullName || profileData.displayName || '',
    email: profileData.email || '',
    photo_url: profileData.photo_url || profileData.photoURL || '',
    enrollment_number: profileData.enrollment_number || profileData.enrollmentNumber || '',
    department: profileData.department || '',
    course: profileData.course || '',
    semester: profileData.semester || profileData.year || '',
    role: profileData.role || 'student', // 'student' | 'faculty' | 'admin'
    is_profile_complete: Boolean(
      (profileData.enrollment_number || profileData.enrollmentNumber) &&
      profileData.department &&
      profileData.role
    ),
    updated_at: new Date().toISOString(),
  };

  if (!isFirebaseConfigured || !db) {
    try {
      localStorage.setItem(`firebase_profile_${uid}`, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn(e);
    }
    return dataToSave;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, dataToSave, { merge: true });
    return dataToSave;
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
    throw error;
  }
}

// 6. Firestore: Fetch Queries for current user / role
export async function fetchQueriesFromFirestore({ role, userId, userEmail }) {
  if (!isFirebaseConfigured || !db) return [];

  try {
    const queriesRef = collection(db, 'queries');
    let q;

    if (role === 'student' && userId) {
      // Students only view their own queries
      q = query(queriesRef, where('student_id', '==', userId));
    } else {
      // Faculty and Admins view all queries
      q = query(queriesRef);
    }

    const snapshot = await getDocs(q);
    const list = [];
    snapshot.forEach((doc) => {
      const d = doc.data();
      list.push(formatFirestoreQuery(d, doc.id));
    });
    return list;
  } catch (error) {
    console.error('Error fetching queries from Firestore:', error);
    return [];
  }
}

// 7. Firestore: Insert Query
export async function saveQueryToFirestore(queryData) {
  if (!isFirebaseConfigured || !db) return;

  try {
    const queryId = queryData.id || `QRY-${Date.now()}`;
    const docRef = doc(db, 'queries', queryId);

    const dataToSave = {
      id: queryId,
      student_id: queryData.studentId || queryData.student_id || '',
      student_name: queryData.studentName || queryData.student_name || '',
      student_roll: queryData.studentRoll || queryData.student_roll || '',
      student_email: queryData.email || queryData.student_email || '',
      title: queryData.title || queryData.subject || '',
      subject: queryData.subject || queryData.title || '',
      category: queryData.category || 'General',
      description: queryData.description || '',
      priority: queryData.priority || 'Medium',
      status: queryData.status || 'Pending',
      assigned_to: queryData.assignedTo || 'Unassigned',
      assigned_faculty_id: queryData.assignedFacultyId || null,
      assigned_dept: queryData.assignedDept || '',
      suggested_answer: queryData.suggestedAnswer || '',
      certainty_score: queryData.certaintyScore || 0,
      matched_rule: queryData.matchedRule || '',
      explanation: queryData.explanation || '',
      tags: queryData.tags || [],
      replies: queryData.replies || [],
      attachments: queryData.attachments || [],
      status_history: queryData.statusHistory || [],
      created_at: queryData.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await setDoc(docRef, dataToSave, { merge: true });
    return dataToSave;
  } catch (error) {
    console.error('Error saving query to Firestore:', error);
  }
}

// 8. Firestore: Update Query Status & Replies
export async function updateQueryInFirestore(queryId, updateFields) {
  if (!isFirebaseConfigured || !db || !queryId) return;

  try {
    const docRef = doc(db, 'queries', queryId);
    await updateDoc(docRef, {
      ...updateFields,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating query in Firestore:', error);
  }
}

// Helper: Format Firestore doc to match UI query structure
function formatFirestoreQuery(data, docId) {
  return {
    id: data.id || docId,
    studentId: data.student_id,
    studentName: data.student_name,
    studentRoll: data.student_roll,
    email: data.student_email,
    title: data.title || data.subject,
    subject: data.subject || data.title,
    category: data.category,
    description: data.description,
    priority: data.priority,
    status: data.status,
    assignedTo: data.assigned_to,
    assignedFacultyId: data.assigned_faculty_id,
    assignedDept: data.assigned_dept,
    suggestedAnswer: data.suggested_answer,
    certaintyScore: data.certainty_score,
    matchedRule: data.matched_rule,
    explanation: data.explanation,
    tags: data.tags || [],
    replies: data.replies || [],
    attachments: data.attachments || [],
    statusHistory: data.status_history || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

