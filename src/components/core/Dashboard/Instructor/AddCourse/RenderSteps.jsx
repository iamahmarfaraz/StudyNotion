import React from 'react';
import { useSelector } from 'react-redux';
import { FaCheck } from "react-icons/fa";
import CourseInformationForm from './CourseInformation/CourseInformationForm.jsx';
import CourseBuilderForm from './CourseBuilderForm/CourseBuilderForm.jsx';
import PublishCourse from './PublishedCourse.jsx';

const Rendersteps = () => {
  const { step } = useSelector((state) => state.course || { step: 1 });

  const stepsData = [
    { id: 1, title: "Course Information" },
    { id: 2, title: "Course Builder" },
    { id: 3, title: "Publish" },
  ];

  return (
    <>
      {/* Progress Bar */}
      <div className='relative mb-2 flex w-full flex-col items-center sm:flex-row justify-center'>
        {stepsData.map((item) => (
          <React.Fragment key={item.id}>
            <div className={`flex flex-col items-center`}>
              <button
                className={`grid cursor-default aspect-square w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] place-items-center rounded-full border-[1px] ${
                  step === item.id
                    ? 'bg-yellow-900 border-yellow-50 text-yellow-50'
                    : 'border-richblack-700 bg-richblack-800 text-richblack-300'
                } transition-all duration-2 ${
                  step > item.id ? 'bg-yellow-50 text-yellow-900' : ''
                }`}
              >
                {step > item.id ? <FaCheck /> : item.id}
              </button>
            </div>
            {/* dashesh between the label 1------2------3 */}
            {item.id !== stepsData.length && (
              <div
                className={`hidden sm:block h-[2px] w-[33%] border-dashed border-b-2 ${
                  step > item.id ? 'border-yellow-50' : 'border-richblack-500'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Title */}
      <div className='flex flex-col sm:flex-row relative mb-8 sm:mb-16 w-full select-none justify-between'>
        {stepsData.map((item) => (
          <div className='flex min-w-[100px] sm:min-w-[130px] flex-col items-center gap-y-2' key={item.id}>
            <p className='text-xs sm:text-sm text-richblack-5'>{item.title}</p>
          </div>
        ))}
      </div>

      {/* Forms for 3 different steps */}
      <div className='w-full'>
        {step === 1 && <CourseInformationForm />}
        {step === 2 && <CourseBuilderForm />}
        {step === 3 && <PublishCourse />}
      </div>
    </>
  );
};

export default Rendersteps;
