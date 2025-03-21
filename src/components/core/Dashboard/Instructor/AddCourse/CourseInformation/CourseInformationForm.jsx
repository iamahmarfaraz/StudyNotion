import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { MdNavigateNext } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../../utils/constants";
import IconBtn from "../../../../../common/IconBtn";
import Upload from "../Upload";
import ChipInput from "./ChipInput"; 
import RequirementsField from "./RequirementField";

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { course, editCourse,step } = useSelector((state) => state.course || {});
  const [loading, setLoading] = useState(false);
  const [courseCategories, setCourseCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        const categories = await fetchCourseCategories();
        
        if (categories && Array.isArray(categories) && categories.length > 0) {
          setCourseCategories(categories);
        } else {
          // Handle empty or undefined response
          toast.error("No categories found.");
        }
      } catch (error) {
        // Handle the error
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to fetch course categories.");
      } finally {
        setLoading(false);
      }
    };

    
  
    // If form is in edit mode, populate existing course details
    if (editCourse) {
      setValue("courseTitle", course?.courseName || "");
      setValue("courseShortDesc", course?.courseDescription || "");
      setValue("coursePrice", course?.price || 0);
      setValue("courseTags", course?.tag || []);
      setValue("courseBenefits", course?.whatYouWillLearn || "");
      setValue("courseCategory", course?.category || "");
      setValue("courseRequirements", course?.instructions || []);
      setValue("courseImage", course?.thumbnail || "");
      setValue("courseLanguage", course?.language || "");
      setValue("courseLevel", course?.level || "");
    }
  
    getCategories();
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("Step updated:", step);
  }, [step]);
  
  

  const isFormUpdated = () => {
    const currentValues = getValues();
    // console.log("changes after editing form values:", currentValues)

    // ek bhi cheez update hui ho to updateCourse chalega
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseLanguage !== course.language ||
      currentValues.courseLevel !== course.level
    ) {
      return true;
    }
    return false;
  };

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        // console.log(data)
        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }

        if (currentValues.courseLanguage !== course.language) {
          formData.append("courseLanguage", data.courseLanguage);
        }
        if (currentValues.courseLevel !== course.level) {
          formData.append("courseLevel", data.courseLevel);
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          console.log("Step before dispatch:", step);
          dispatch(setStep(2));
          console.log("Step after dispatch:", step);

          dispatch(setCourse(result));
        }
      } else {
        console.log("Testing Failed")
        toast.error("No changes made to the form");
      }
      
      return;
    }

    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseRequirements));
    formData.append("thumbnailImage", data.courseImage);
    formData.append("courseLanguage", data.courseLanguage);
    formData.append("courseLevel", data.courseLevel);
    setLoading(true);
    const result = await addCourseDetails(formData, token);
    if (result) {
      dispatch(setStep(2));
      dispatch(setCourse(result));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full p-2 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full
          p-2 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>
      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12 py-2 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-25" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>
      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full p-2 h-8 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Level */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Level <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseLevel", { required: true })}
          defaultValue=""
          id="courseLevel"
          className="form-style w-full h-8 p-2 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
        >
          <option value="" disabled>
            Choose a Level
          </option>
          {!loading &&
            ["All", "Beginner","Intermediate","Adavance"]?.map((level, indx) => (
              <option key={indx} value={level}>
                {level}
              </option>
            ))}
        </select>
        {errors.courseLevel && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Level is required
          </span>
        )}
      </div>

      {/* Course language */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseLanguage">
          Course Language
          <sup className="text-pink-200">*</sup>
        </label>
        <select
          id="courseLanguage"
          {...register("courseLanguage", { required: true })}
          className="form-style w-full p-2 h-8 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
          defaultValue=""
        >
          <option value="" disabled>
            Choose a Language
          </option>
          {!loading &&
            ["English", "Hindi"]?.map((level, indx) => (
              <option key={indx} value={level}>
                {level}
              </option>
            ))} 
        </select>
        {errors.courseLanguage && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Language is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail" 
        register={register}
        setValue={setValue} 
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full
          p-2 rounded-lg bg-richblack-400 text-richblack-25 border-b-2 border-richblack-300"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
}