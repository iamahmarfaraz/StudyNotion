import React from 'react'
import InstructorImg from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'


const Instructor = () => {
  return (
    <div className='mt-4 text-white'>
      
        <div className='flex flex-col lg:flex-row gap-20 items-center '>

            <div className='w-fit shadow-[20px_20px_rgba(255,255,255)]'>
                <img src={InstructorImg} alt="Instructor" loading="lazy" 
                className='shadow-white' />
            </div>

            <div className='lg:w-[50%] flex flex-col gap-10'>

                <div className='text-4xl font-semibold lg:w-[50%]'>
                    Become an 
                    <HighlightText text={"Instructor"}></HighlightText>
                </div>

                <p className='font-medium w-[90%] text-richblack-300 text-[16px]'>Instructors from around the world teach millions of students on StudyNotion.
                 We provide the tools and skills to teach what you love.</p>

                 <div className='w-fit'>
                    <CTAButton linkto={"/signup"} active={true}>
                        <div className='flex flex-row gap-2 items-center'> 
                            Start Learning Today
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                 </div>

            </div>

        </div>

    </div>
  )
}

export default Instructor
