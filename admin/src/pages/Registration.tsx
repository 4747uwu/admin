"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Input, { ExInput } from "../extra/Input";
import Logo from "../assets/images/logo.png";
import Image from "next/image";
import Button from "../extra/Button";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import { signUpAdmin } from "@/store/adminSlice";
import loginImage from '../assets/images/login.png'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/component/lib/firebaseConfig";

interface RootState {
  admin: {
    isAuth: boolean;
    admin: Object;
  };
}

export default function Registration() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    code: "",
    general: "",
  });

  // Email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength validation
  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async () => {
    // Reset errors
    setError({
      email: "",
      password: "",
      confirmPassword: "",
      code: "",
      general: "",
    });

    let errorObj: any = {};
    let hasError = false;

    // Validation
    if (!email) {
      errorObj.email = "Email is required!";
      hasError = true;
    } else if (!validateEmail(email)) {
      errorObj.email = "Please enter a valid email address!";
      hasError = true;
    }

    if (!password) {
      errorObj.password = "Password is required!";
      hasError = true;
    } else if (!validatePassword(password)) {
      errorObj.password = "Password must be at least 8 characters long!";
      hasError = true;
    }

    if (!confirmPassword) {
      errorObj.confirmPassword = "Confirm password is required!";
      hasError = true;
    } else if (password !== confirmPassword) {
      errorObj.confirmPassword = "Passwords do not match!";
      hasError = true;
    }

    if (!code) {
      errorObj.code = "Purchase code is required!";
      hasError = true;
    }

    if (hasError) {
      setError(errorObj);
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting registration process...");
      
      // First, register with backend
      const payload = {
        email,
        password,
        code,
      };

      console.log("Sending to backend:", payload);
      
      // Dispatch registration action
      const result = await dispatch(signUpAdmin(payload));
      
      console.log("Backend result:", result);
      
      if (result.type === 'admin/admin/signUp/fulfilled') {
        console.log("Backend registration successful");
        
        // Now create Firebase user
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log("Firebase user created successfully:", userCredential.user.uid);
          
          // Registration successful, redirect to login
          alert("Registration successful! Redirecting to login...");
          router.push('/Login');
        } catch (firebaseError: any) {
          console.warn("Firebase registration failed, but backend succeeded:", firebaseError);
          // Still redirect to login since backend registration worked
          alert("Registration partially successful! Please try logging in.");
          router.push('/Login');
        }
      } else {
        console.error("Backend registration failed:", result);
        setError({ ...errorObj, general: result.payload?.message || "Registration failed. Please try again." });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError({ ...errorObj, general: error.message || "Registration failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="image-section">
        </div>
        <div className="position-absolute"
          style={{ top: "100px", left: "200px" }}
        >
          <img
            src={loginImage.src}
            alt="Login Visual"
            className="login-image"
          />
        </div>

        <div className="form-section">
          <div className="logologin"></div>

          <h2 className="title">Sign Up</h2>
          <p className="subtitle">
            Welcome! Please enter your email, password and purchase code to register your account.
          </p>

          {error.general && (
            <div className="alert alert-danger" role="alert">
              {error.general}
            </div>
          )}

          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Enter your Email</label>
              <input 
                type="email" 
                value={email} 
                placeholder="Enter your email"
                className="custom-input"
                disabled={isLoading}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!e.target.value) {
                    setError({
                      ...error,
                      email: "Email is required",
                    });
                  } else if (!validateEmail(e.target.value)) {
                    setError({
                      ...error,
                      email: "Please enter a valid email address",
                    });
                  } else {
                    setError({
                      ...error,
                      email: "",
                    });
                  }
                }}
              />
              {error.email && (
                <p className="text-danger">{error.email}</p>
              )}
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label className="mt-2">Enter your Password</label>
              <input
                className="custom-input"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Type your password here (min 8 characters)"
                disabled={isLoading}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (!e.target.value) {
                    setError({
                      ...error,
                      password: "Password is required",
                    });
                  } else if (!validatePassword(e.target.value)) {
                    setError({
                      ...error,
                      password: "Password must be at least 8 characters long",
                    });
                  } else {
                    setError({
                      ...error,
                      password: "",
                    });
                  }
                }}
                style={{ paddingRight: "40px" }}
              />

              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="showpassword"
                style={{
                  position: "absolute",
                  top: "62%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#aaa",
                }}
              >
                {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
              </span>

              {error.password && (
                <p className="text-danger">{error.password}</p>
              )}
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label className="mt-2">Confirm Password</label>
              <input
                className="custom-input"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm your password"
                disabled={isLoading}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (!e.target.value) {
                    setError({
                      ...error,
                      confirmPassword: "Confirm password is required",
                    });
                  } else if (password !== e.target.value) {
                    setError({
                      ...error,
                      confirmPassword: "Passwords do not match",
                    });
                  } else {
                    setError({
                      ...error,
                      confirmPassword: "",
                    });
                  }
                }}
                style={{ paddingRight: "40px" }}
              />

              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="showpassword"
                style={{
                  position: "absolute",
                  top: "62%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#aaa",
                }}
              >
                {showConfirmPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
              </span>

              {error.confirmPassword && (
                <p className="text-danger">{error.confirmPassword}</p>
              )}
            </div>

            <div className="form-group">
              <label>Enter your Purchase Code</label>
              <input 
                type="text" 
                value={code} 
                placeholder="Enter your purchase code"
                className="custom-input"
                disabled={isLoading}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (!e.target.value) {
                    setError({
                      ...error,
                      code: "Purchase code is required",
                    });
                  } else {
                    setError({
                      ...error,
                      code: "",
                    });
                  }
                }}
              />
              {error.code && (
                <p className="text-danger">{error.code}</p>
              )}
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={handleSubmit} 
                className="demo-login-btn mt-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>

            <div className="text-center mt-3">
              <p>Already have an account? <a href="/Login" className="text-primary">Login here</a></p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
