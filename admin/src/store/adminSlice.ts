"use client";

import { apiInstance, apiInstanceFetch } from "@/utils/ApiInstance";
import { jwtDecode } from "jwt-decode";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setToast } from "@/utils/toastServices";
import { SetDevKey, setToken } from "@/utils/setAuthAxios";
import { key } from "@/utils/config";
import axios from "axios";
import { DangerRight } from "@/api/toastServices";
import CryptoJS from "crypto-js";

interface UserState {
  isAuth: boolean;
  admin: any;
  countryData: any[];
  isLoading: boolean;
}
const flag: any =
  typeof window !== "undefined" && sessionStorage.getItem("admin_");
const initialState: UserState = {
  isAuth: false,
  admin: {},
  isLoading: false,
  countryData: [],
};

interface AllUsersPayload {
  adminId: string;
  start?: number;
  limit?: number;
  startDate?: string;
  data: any;
  endDate?: string;
  payload?: any;
  type?: string;
}

const token = typeof window !== "undefined" && sessionStorage.getItem("token"); // This will be Firebase token
const uid = typeof window !== "undefined" && sessionStorage.getItem("uid");

export const signUpAdmin = createAsyncThunk(
  "admin/admin/signUp",
  async (payload: any) => {
    return apiInstanceFetch.post("api/admin/signUp", payload);
  }
);

export const login = createAsyncThunk(
  "api/admin/admin/validateAdminLogin",
  async (payload: any) => {
    // Don't send Firebase token for initial login - backend will validate email/password
    return apiInstanceFetch.post("api/admin/validateAdminLogin", payload);
  }
);

export const sendEmailandForgotPassword = createAsyncThunk(
  "api/admin/admin/sendPasswordResetRequest",
  async (email: any) => {
    return axios.post(
      `api/admin/admin/sendPasswordResetRequest?email=${email}`
    );
  }
);

export const adminProfileGet = createAsyncThunk(
  "api/admin/admin/retrieveAdminProfile",
  async (payload: AllUsersPayload | undefined) => {
    const firebaseToken = sessionStorage.getItem("token"); // Firebase token
    const adminUid = sessionStorage.getItem("uid");

    return apiInstanceFetch.get(`api/admin/retrieveAdminProfile`, {
      headers: {
        Authorization: firebaseToken ? `Bearer ${firebaseToken}` : "",
        "x-admin-uid": adminUid || "",
        key: key,
      },
    });
  }
);

export const adminProfileUpdate: any = createAsyncThunk(
  "api/admin/admin/modifyAdminProfile",
  async (payload: AllUsersPayload | undefined) => {
    const firebaseToken = sessionStorage.getItem("token");
    const adminUid = sessionStorage.getItem("uid");

    return apiInstanceFetch.patch(`api/admin/modifyAdminProfile`, payload, {
      headers: {
        Authorization: firebaseToken ? `Bearer ${firebaseToken}` : "",
        "x-admin-uid": adminUid || "",
        key: key,
      },
    });
  }
);

export const updateAdminPassword: any = createAsyncThunk(
  "api/admin/admin/modifyPassword",
  async (payload: AllUsersPayload | undefined) => {
    const firebaseToken = sessionStorage.getItem("token");
    const adminUid = sessionStorage.getItem("uid");

    return apiInstanceFetch.patch(`api/admin/modifyPassword`, payload, {
      headers: {
        Authorization: firebaseToken ? `Bearer ${firebaseToken}` : "",
        "x-admin-uid": adminUid || "",
        key: key,
      },
    });
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    logoutApi(state: any) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("key");
      state.admin = {};
      state.isAuth = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder: any) => {
    builder.addCase(
      signUpAdmin.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      signUpAdmin.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload && action.payload?.status !== false) {
          setToast("success", "Admin Sign Up Successfully");
          window.location.href = "/dashboard";
        } else {
          setToast("error", action.payload?.message);
        }
      }
    );
    builder.addCase(
      signUpAdmin.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(login.pending, (state: any, action: PayloadAction<any>) => {
      state.isLoading = true;
    });
    builder.addCase(
      login.fulfilled,
      (state: any, action: any) => {
        console.log("Full login response:", action.payload);

        if (action.payload && action.payload.status === true) {
          setToast("success", "Login Successfully");

          // Fix: Get the JWT token from the correct path
          const backendToken = action.payload.token; // Changed from action.payload.data.token
          const adminData = action.payload.data; // Changed from action.payload.data.data

          console.log("Backend token:", backendToken);
          console.log("Admin data:", adminData);

          if (backendToken) {
            try {
              // Decode the backend JWT token for admin data
              const decodedToken: any = jwtDecode(backendToken);
              console.log("Decoded backend token:", decodedToken);

              // Store admin data
              sessionStorage.setItem("admin_", JSON.stringify(adminData));
              sessionStorage.setItem("backend_token", backendToken); // Store backend token separately

              state.isAuth = true;
              sessionStorage.setItem("isAuth", "true");
              state.admin = decodedToken;

              SetDevKey(key);

              const encrypted = CryptoJS.AES.encrypt(
                action?.meta?.arg?.password,
                key
              ).toString();
              sessionStorage.setItem("data", encrypted);

              // Don't redirect here - let the Login.tsx handle Firebase authentication first
              console.log("Backend login processed, waiting for Firebase...");
            } catch (jwtError) {
              console.error("JWT Decode error:", jwtError);
              DangerRight("Invalid token format received from backend");
            }
          } else {
            console.error("Token not found in response:", action.payload);
            DangerRight("No token received from backend");
          }

          state.isLoading = false;
        } else {
          console.error("Login failed:", action.payload);
          DangerRight(action.payload?.message || "Login failed");
          state.isLoading = false;
        }
      }
    );
    builder.addCase(
      login.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      sendEmailandForgotPassword.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      sendEmailandForgotPassword.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload?.data?.status === true) {
          setToast("success", action?.payload?.data?.message);
        } else if (action?.payload?.data?.status === false) {
          DangerRight(action?.payload?.data?.message || action?.payload?.message);
        }
      }
    );
    builder.addCase(
      sendEmailandForgotPassword.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      adminProfileGet.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isSkeleton = true;
      }
    );
    builder.addCase(
      adminProfileGet.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        console.log("📥 [adminProfileGet.fulfilled] Raw action payload:", action.payload);
        console.log("📥 [adminProfileGet.fulfilled] Response data:", action.payload?.data);

        state.isSkeleton = false;

        // The data is directly under payload.data, not payload.data.data
        const apiData = action.payload?.data;
        console.log("🔍 [adminProfileGet.fulfilled] API Data structure:", {
          _id: apiData?._id,
          name: apiData?.name,
          email: apiData?.email,
          image: apiData?.image,
        });

        state.admin = {
          ...state.admin,
          _id: apiData?._id,
          name: apiData?.name,
          email: apiData?.email,
          image: apiData?.image,
        };

        console.log("✅ [adminProfileGet.fulfilled] Updated admin state:", state.admin);
      }
    );
    builder.addCase(
      adminProfileGet.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isSkeleton = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      adminProfileUpdate.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      adminProfileUpdate.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        console.log("📥 [adminProfileUpdate.fulfilled] Raw action payload:", action.payload);
        console.log("📥 [adminProfileUpdate.fulfilled] Response data:", action.payload.data);

        state.isLoading = false;
        if (action.payload.data?.status === true) {
          // The updated data is directly under payload.data, not payload.data.data
          const updateData = action.payload.data;
          console.log("🔄 [adminProfileUpdate.fulfilled] Update data received:", updateData);

          // Update the admin state with the new data
          state.admin = {
            ...state.admin,
            _id: updateData._id,
            name: updateData.name,
            email: updateData.email,
            image: updateData.image,
          };

          console.log("✅ [adminProfileUpdate.fulfilled] Updated admin state after update:", state.admin);

          // Also update sessionStorage
          sessionStorage.setItem("admin_", JSON.stringify(state.admin));

          setToast("success", "Admin Profile Update Successful");

          const prevEmail = state.admin?.email;
          const updatedEmail = updateData.email;

          // Only redirect if email changed
          if (prevEmail && updatedEmail && prevEmail !== updatedEmail) {
            setTimeout(() => {
              window.location.href = "/";
            }, 1000);
          }
        } else {
          console.log("❌ [adminProfileUpdate.fulfilled] Update failed:", action.payload.data.message);
          setToast("error", action.payload.data.message);
        }
      }
    );

    builder.addCase(
      adminProfileUpdate.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );

    builder.addCase(
      updateAdminPassword.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      updateAdminPassword.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.data?.status === true) {
          state.admin = action.payload.data?.data;
          setToast("success", "Admin Password Update Successful");

          window.location.href = "/";
        } else {
          setToast("error", action.payload.data.message);
        }
      }
    );
    builder.addCase(
      updateAdminPassword.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );
  },
});

export const { logoutApi, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
