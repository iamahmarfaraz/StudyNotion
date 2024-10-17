import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { changePassword } from "../../../../services/operations/SettingsAPI";
import IconBtn from "../../../common/IconBtn";

const UpdatePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitPasswordForm = async (data) => {
    // console.log("Form submitted"); // Ensure this is printed on submission
    // console.log("Errors: ", errors);
    // console.log("Form Data: ", data); // Ensure form data is printed here
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors detected.");
      return;
    }
    try {
      await changePassword(token, data);
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
      <form
        onSubmit={(e) => {
          console.log("Form submitted"); // Log to ensure form submission works
          handleSubmit(submitPasswordForm)(e);
        }}
      >
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 xs:p-8 xs:px-12 p-2 px-4">
          <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="oldPassword" className="lable-style text-richblack-5">
                Current Password
              </label>
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style p-2 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
                {...register("oldPassword", {
                  required: true,
                })}
              />
              <span
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showOldPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newPassword" className="lable-style text-richblack-5">
                New Password
              </label>
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style p-2 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
                {...register("newPassword", {
                  required: true,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}$/,
                })}
              />
              <span
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                    {"Password must include 8-16 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character."}
                    {console.log("Pass Error :- ",errors.newPassword?.message)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile");
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update" />
        </div>
      </form>
  );
};

export default UpdatePassword;
