import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"


const timeline = [
    {
        Logo: Logo1,
        heading: "Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo: Logo2,
        heading: "Responsibility",
        Description:"Students will always be our top priority",
    },
    {
        Logo: Logo3,
        heading: "Flexibility",
        Description:"The ability to switch is an important skills",
    },
    {
        Logo: Logo4,
        heading: "Solve the problem",
        Description:"Code your way to a solution",
    },
];

const TimelineComp = () => {
  return (
    <div>
      <div className='flex flex-col lg:flex-row gap-14 lg:gap-24 justify-between items-center'>

        <div className='lg:w-[45%] h-full flex flex-col gap-9 lg:gap-16'>
            {
                timeline.map((element, index) => {
                return (
                    <div className=' flex flex-row gap-6' key={index}>
                        {/* Container for logo with dotted line */}
                        <div className='relative flex flex-col items-center'>

                            <div className='w-[50px] h-[50px] rounded-full shadow-[0_0_62px_0] shadow-[#00000012]
                            bg-white flex items-center group justify-center '>
                                <img src={element.Logo} alt={`logo-${index}`} className='group-hover:animate-bounce' loading='lazy' />
                            </div>

                            {/* Dotted line below the logo */}
                            {index !== timeline.length - 1 && (
                            <div className='w-[1px] h-[80%] absolute top-[60px] border-l-2 border-dotted border-pure-greys-200'></div>
                            )}

                        </div>

                        {/* Heading and description */}
                        <div className=''>

                            <h2 className='font-semibold  text-[18px]'>{element.heading}</h2>
                            <p className='text-base'>{element.Description}</p>

                        </div>

                    </div>
                    )
                })
           }
        </div>

        <div className='relative shadow-caribbeangreen-400 shadow-[10px_-5px_80px_-5px]'>

            <div className='shadow-[20px_20px_rgba(255,255,255)]'>
                <img  src={timelineImage}
                alt="timelineImage"
                className='shadow-white object-cover h-[400px] lg:h-fit'
                />
            </div>

            <div className='absolute bg-caribbeangreen-700 flex flex-col lg:flex-row text-white uppercase lg:py-8 py-4 
                          gap-3 lg:gap-4 top-0 lg:top-[100%] lg:w-fit w-[80%] h-fit lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[-50%]'>
                <div className='flex flex-row gap-5 items-center lg:border-r border-caribbeangreen-300 lg:px-7 px-9'>
                    <p className='text-3xl font-bold'>10</p>
                    <p className='text-caribbeangreen-300 text-sm'>Years of Experience</p>
                </div>

                <div className='flex gap-5 items-center px-7'>
                <p className='text-3xl font-bold'>250</p>
                    <p className='text-caribbeangreen-300 text-sm'>TYpe of Courses</p>
                </div>

            </div>

        </div>
      </div>
    </div>
  )
}

export default TimelineComp
