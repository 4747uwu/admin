"use client";
import { DangerRight } from "@/api/toastServices";
import loginImage from "@/assets/images/login.png";
import { login, setLoading } from "@/store/adminSlice";
import { useAppDispatch } from "@/store/store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Logo from "../assets/images/logo.png";
import { auth } from "../component/lib/firebaseConfig";
import { setToken } from "@/utils/config"; // Add this import

interface RootState {
  admin: {
    isAuth: boolean;
    admin: Object;
    isLoading: boolean;
  };
}

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuth, admin, isLoading } = useSelector(
    (state: RootState) => state.admin
  );
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [demoLogin, setDemoLogin] = useState<boolean>(false);
  const [loginLoading , setLoginLoading] = useState<boolean>(false);
  const [error, setError] = useState({
    email: "",
    password: "",
  });




  const handleSubmit = async () => {
    dispatch(setLoading(true));
    setLoginLoading(true);
    
    // Reset errors
    setError({ email: "", password: "" });
    
    if (!email || !password) {
      let errorObj: any = {};
      if (!email) errorObj.email = "Email Is Required!";
      if (!password) errorObj.password = "Password is required!";
      setError(errorObj);
      dispatch(setLoading(false));
      setLoginLoading(false);
      return;
    }

    try {
      console.log("Starting login process...");
      
      // Step 1: Backend login first
      const payload = { email, password };
      const result = await dispatch(login(payload));
      
      console.log("Backend result:", result);
      
      if (result.type === 'api/admin/admin/validateAdminLogin/fulfilled') {
        console.log("Backend login successful, now getting Firebase token...");
        
        try {
          // Step 2: Get Firebase token
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Get Firebase ID Token (this is what your backend expects)
          const firebaseIdToken = await user.getIdToken(true);
          const uid = user.uid;
          
          console.log("Firebase login successful!");
          console.log("Firebase UID:", uid);
          console.log("Firebase Token:", firebaseIdToken);
          
          // Store Firebase token (override the JWT token with Firebase token)
          sessionStorage.setItem("token", firebaseIdToken);  // Store Firebase token
          sessionStorage.setItem("uid", uid);
          sessionStorage.setItem("backend_token", result.payload.token); // Store backend JWT separately
          
          // Update the Redux store with Firebase token
          setToken(firebaseIdToken);
          
          console.log("Both authentications successful!");
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 500);
          
        } catch (firebaseError: any) {
          console.error("Firebase login failed:", firebaseError);
          
          // If Firebase fails, check if the user exists in Firebase
          if (firebaseError.code === 'auth/user-not-found') {
            DangerRight("Admin not found in Firebase. Please contact support.");
          } else if (firebaseError.code === 'auth/wrong-password') {
            DangerRight("Firebase password doesn't match. Please contact support.");
          } else {
            DangerRight("Firebase authentication failed: " + firebaseError.message);
          }
        }
        
      } else {
        console.error("Backend login failed:", result);
        setError({ email: "", password: "Invalid credentials" });
        DangerRight("Invalid email or password");
      }

    } catch (error: any) {
      console.error("Login error:", error);
      setError({ email: "", password: "Login failed. Please try again." });
      DangerRight("Login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
      setLoginLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      // Sign in user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential?.user?.uid; // ✅ Fix: Declare uid

      if (!userCredential.user) {
        console.error("No user found after login");
        return null;
      }

      // Get Firebase Auth Token
      const token = await userCredential?.user?.getIdToken(true); // ✅ Force refresh
      // Store token in localStorage or sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("uid", uid);

      return token;
    } catch (error: any) {
      DangerRight("Invalid credentials. Please check your email and password.");
      return null;
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    
  };

  return (
    <>
       <div className="login-container">
        <div className="image-section">

        <div
          // className="position-absolute"
          style={{ top: "100px", left: "200px" }}
        >
          <img
            src={loginImage.src}
            alt="Login Visual"
            className="login-image"
          />
        </div>
        </div>

        <div className="form-section">
          <div  style={{
            width : "50%",
            margin: "auto"
          }}>
          <div className="logologin">
            <img
              src={Logo.src}
              width={80}
              height={80}
            />
          </div>

          <h2 className="title">Login to your account</h2>
          <p className="subtitle">
           Let's connect, chat, and spark real connections. Enter your credentials to continue your journey.
          </p>

          <form className="login-form">
            <div className="form-group">
              <label>Enter your Email</label>
              <input
                type="text"
                value={email}
                placeholder="Enter your email"
                onKeyDown={handleKeyPress}
                onChange={(e: any) => {
                  setEmail(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      email: `email Id is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      email: "",
                    });
                  }
                }}
              />
              <span className="text-danger" style={{fontSize : "12px"}}>{error.email}</span>
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label className="mt-2">Enter your Password</label>
              <input
                type={showPassword ? "text" : "password"}  // Fix: Change from always "text"
                value={password}
                placeholder="Enter your password"
                onChange={(e: any) => {
                  setPassword(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      password: `password is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      password: "",
                    });
                  }
                }}
                onKeyDown={handleKeyPress}
              />
              <span className="text-danger" style={{fontSize : "12px"}}>{error.password}</span>
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="showpassword"
                style={{
                  position: "absolute",
                  top: "75%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#aaa",
                }}
              >
                {showPassword ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}{" "}
                {/* You can use real icons */}
              </span>
            </div>

            <div className="form-actions">
             <button
                type="button"
                disabled={isLoading}
                onClick={handleSubmit}
                className="login-btn"
              >
                {loginLoading ? "Loading..." : "Log In"}
              </button>
              
            </div>
          </form>
          </div>
        </div>
      </div>
    </>
  );
}
