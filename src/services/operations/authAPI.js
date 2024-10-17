import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { resetWishlist } from "../../slices/wishlistSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"
import { jwtDecode } from 'jwt-decode';


const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints



export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}



export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Token handling and storage
      const token = response.data.token;
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000 - Date.now(); // Calculate expiration time in milliseconds

      toast.success("Login Successful");

      // Dispatch token and user information to Redux
      dispatch(setToken(token));
      const userImage = response.data?.existingUser?.image
        ? response.data.existingUser.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.existingUser.firstName} ${response.data.existingUser.lastName}`;
      dispatch(setUser({ ...response.data.existingUser, image: userImage }));

      // Save token and user data in localStorage
      localStorage.setItem("token", JSON.stringify(token));
      localStorage.setItem("user", JSON.stringify(response.data.existingUser));

      // Set a timeout to log the user out automatically when the token expires
      setTimeout(() => {
        
        dispatch(logout(navigate));
        const toastSes = toast.error("Session expired. Please log in again.")
        alert("Session expired. Please log in again.");
        
        navigate("/login");
        toast.dismiss(toastSes);
      }, expirationTime);

      // Navigate to profile page after login
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("LOGIN API ERROR............", error);
      toast.error("Login Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}


export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    dispatch(resetWishlist())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("cart")
    localStorage.removeItem("total")
    localStorage.removeItem("totalItems")
    localStorage.removeItem("wishlist")
    localStorage.removeItem("totalWishlist")
    localStorage.removeItem("totalWishlistItems")
    toast.success("Logged Out")
    navigate("/")
  }
}



export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})
      console.log("Inside services/operations/authAPI.js")
      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

      console.log("RESET Password RESPONSE ... ", response);


      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  }
}

