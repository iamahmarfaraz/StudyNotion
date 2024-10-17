import { toast } from "react-hot-toast"

import { setLoading } from "../../slices/authSlice"
import { apiConnector } from "../apiconnector"
import {contactusEndpoint } from "../apis"

const {CONTACT_US_API} = contactusEndpoint;

export function contactUsForm(countrycode,email, firstName, lastName, message, phoneNo){
    return async(dispatch) => {
      dispatch(setLoading(true));
      try {
        const response = await apiConnector("POST", CONTACT_US_API, {
          countrycode,email, firstName, lastName, message, phoneNo,
        })
        console.log("Contact Us RESPONSE ... ", response);
  
  
        if(!response.data.success) {
          throw new Error(response.data.message);
        }
  
        toast.success("Feedback Submit Successfully");
  
      } catch (error) {
        console.log("Feedback sent Error :- ", error);
        toast.error("Unable to sent feedback");
      }
      dispatch(setLoading(false));
    }
  }