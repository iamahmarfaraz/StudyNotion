import React from 'react'
import { Link } from 'react-router-dom'
import "./ThreeDbutton.css"

const ThreeDbutton = ({children,linkto}) => {
  return (
    <Link to={linkto}>
        <button className="btn-3d">{children}</button>
    </Link>
  )
}

export default ThreeDbutton
