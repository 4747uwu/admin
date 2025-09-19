
export const baseURL: string = "http://figgy-backend:5000/"
export const key: string = "secretKey"; // Admin access key for backend authentication
export const projectName: string = "datingapp-146b1"; // Your Firebase project name
export const apiKey: string = "AIzaSyCeAVElG9K95I3GZmB3rylpbcQ1diVRY5k";
export const authDomain: string = "datingapp-146b1.firebaseapp.com";
export const projectId: string = "datingapp-146b1";
export const storageBucket: string = "datingapp-146b1.firebasestorage.app";
export const messagingSenderId: string = "33407529474";
export const appId: string = "1:33407529474:web:3938707bcfede91050ad1b";
export const measurementId: string = "G-K4VKLTEDLJ";

// Add this function if it doesn't exist
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("token", token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem("token");
  }
  return null;
};

export const SetDevKey = (key: string) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem("devKey", key);
  }
};

