import React from 'react'
import { Link } from 'react-router-dom'

const CTAButton = ({children,active,linkto}) => {
  return (
    <Link to={linkto}>
        <div className={`text-center text-[12px] sm:text-[16px] px-3 lg:px-6 py-3 rounded-md font-bold border-2 text-base
        ${active ? "bg-yellow-50 text-black border-b-yellow-5 border-r-yellow-5 border-t-transparent border-l-transparent" : "bg-richblack-800 border-b-richblack-700 border-r-richblack-700 border-t-transparent border-l-transparent" }
        hover:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl
        `}>
            {children}
        </div>
    </Link>
  )
}

export default CTAButton
