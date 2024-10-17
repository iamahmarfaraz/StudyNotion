import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchInstructorCourses } from "../../../../../services/operations/courseDetailsAPI";
import { getInstructorData } from "../../../../../services/operations/profileAPI";
import { Link } from "react-router-dom";
import InstructorChart from "./InstructorChart";

const Instructor = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState(null);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getCourseDataWithStats = async () => {
      setLoading(true);
      const instructorApiData = await getInstructorData(token);
      const result = await fetchInstructorCourses(token);

      if (instructorApiData.length) {
        setInstructorData(instructorApiData);
      }

      if (result) {
        setCourses(result);
      }

      setLoading(false);
    };

    getCourseDataWithStats();
  }, [token]);

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  );
  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  );

  return (
    <div className="p-4">
      {/* Section one */}
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold text-richblack-5">Hi {user?.firstName} 👋</h1>
        <p className="font-medium text-richblack-200">Let's start something new</p>
      </div>

      {/* Loading and Course Sections */}
      {loading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : courses.length > 0 ? (
        <>
          <div className="flex flex-col gap-6">
            {/* Section 2 */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <InstructorChart courses={instructorData} />
              </div>

              {/* Section 3 - Statistics */}
              <div className="min-w-[250px] flex flex-col rounded-md bg-richblack-800 p-6 space-y-4">
                <p className="text-lg font-bold text-richblack-5">Statistics</p>

                <div className="space-y-4">
                  <div>
                    <p className="text-lg text-richblack-200">Total Courses</p>
                    <p className="text-3xl font-semibold text-richblack-50">{courses.length}</p>
                  </div>

                  <div>
                    <p className="text-lg text-richblack-200">Total Students</p>
                    <p className="text-3xl font-semibold text-richblack-50">{totalStudents}</p>
                  </div>

                  <div>
                    <p className="text-lg text-richblack-200">Total Income</p>
                    <p className="text-3xl font-semibold text-richblack-50">Rs {totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Last section - Courses */}
            <div className="rounded-md bg-richblack-800 p-6">
              {/* Heading */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <Link to="/dashboard/my-courses">
                  <p className="text-xs font-semibold text-yellow-50">View All</p>
                </Link>
              </div>

              {/* Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 3).map((course, index) => (
                  <div key={index} className="flex flex-col">
                    <img
                      src={course.thumbnail}
                      alt="course-img"
                      className="h-[201px] w-full rounded-md object-cover"
                    />

                    <div className="mt-3 w-full">
                      <p className="text-sm font-medium text-richblack-50">{course.courseName}</p>

                      <div className="mt-1 flex items-center space-x-2">
                        <p className="text-xs font-medium text-richblack-300">
                          {course.totalStudentsEnrolled} Students
                        </p>
                        <p className="text-xs font-medium text-richblack-300">|</p>
                        <p className="text-xs font-medium text-richblack-300">Rs {course.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20 text-center">
          <p className="text-2xl font-bold text-richblack-5">You have not created any courses yet</p>
          <Link to="/dashboard/addCourse">
            <p className="mt-1 text-lg font-semibold text-yellow-50">Create a Course</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Instructor;
