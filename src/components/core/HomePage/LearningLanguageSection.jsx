import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png"
import AmongUsButton from '../../common/AmongUsButton';


const LearningLanguageSection = () => {

  return (
    <div className='mt-36'>
      <div className='flex flex-col gap-5 items-center'>
  
        <div className='text-4xl text-center font-semibold'>
            Your Swiss Knife for
            <HighlightText text={" learning any language"}></HighlightText>
        </div>

        <div className='text-center text-richblack-600 mx-auto text-base font-medium w-[70%]'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over,
            progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center mt-5'>
            <img src={know_your_progress} alt="knowYourProgress" 
            className='object-contain lg:-mr-36 stg-img1' />
            <img src={compare_with_others} alt="knowYourProgress" 
            className='object-contain lg:mt-0 -mt-12 lg:-mr-10 stg-img2' />
            <img src={plan_your_lessons} alt="knowYourProgress" 
            className='object-contain lg:mt-0 -mt-20 lg:-ml-28 stg-img3' />
        </div>

        <div className='flex items-center mx-auto -mt-5'>
            <AmongUsButton word1={"More"} word2={"Learn"} linkto={"/signup"}></AmongUsButton>
        </div>

      </div>
    </div>
  )
}

export default LearningLanguageSection
