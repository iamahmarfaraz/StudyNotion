import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className='bg-gradient-to-b from-[#1FA2FF] via-[#12d7faf0] to-[#adfbcd] text-transparent bg-clip-text font-bold'> {text}</span>
  )
}

export default HighlightText
