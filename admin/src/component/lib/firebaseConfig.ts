// firebaseConfig.js
import { apiKey, appId, authDomain, measurementId, messagingSenderId, projectId, storageBucket } from "@/utils/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
  };
  
  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);
  export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

  export default app;
