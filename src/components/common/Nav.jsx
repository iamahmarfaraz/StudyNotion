import React, { useEffect, useRef, useState } from 'react';
import "./Nav.css";
import { Link, matchPath, useLocation } from 'react-router-dom';
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links";
import {useSelector} from "react-redux";
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { apiConnector } from '../../services/apiconnector';
import { categories } from '../../services/apis';
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import NavMobile from "./NavMobile";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import SearchMobile from "../core/Search/SearchMobile/SearchMobile";
import SearchWeb from "../core/Search/SearchWeb/SearchWeb";
import Skeleton from "react-loading-skeleton";


const Nav = () => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state)=>state.profile);
    const {totalItems} = useSelector((state)=>state.cart);
    // console.log("Token:", token);
    // console.log("User:", user);
    // console.log("Total Items:", totalItems);


    const [ssubLinks, setSsubLinks]  = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const fetchSublinks = async() => {
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("Printing Sublinks result :- " , result);
            setSsubLinks(result.data.data);
        }
        catch(error) {
            console.log("Could not fetch the category list :- ",error);
        }
    }


    useEffect( () => {
        setLoading(false);
        fetchSublinks();
    },[] )
    

    const location = useLocation();
    const matchRoute = (Route) => {
        return matchPath({path:Route},location.pathname)
    }

    //Mobile navbar
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <div className='flex h-14 items-center justify-center Navv border-b-2 border-richblack-800 bg-richblack-900 
    shadow-custom '>
      <div className='w-11/12 max-w-maxContent flex items-center justify-between mx-auto lg:flex-row flex-row-reverse'>

        {/* image adding and search box*/}
        <div className={`flex items-center lg:gap-2 gap-5`}>
          <Link to="/">
            <img
              src={logo}
              width={164}
              height={45}
              loading="lazy"
              alt="logo"
              className={`transition-[width] duration-1000 ${
                searchOpen ? "w-0" : "w-[120px] xs:w-[160px]"
              } scale-125`}
            />
          </Link>
          <SearchMobile
            searchOpen={searchOpen}
            setSearchOpen={setSearchOpen}
            subLinks={ssubLinks}
          />
        </div>

        {/* Nav Links */}
        <nav className="lg:inline-block hidden">
            <ul className='flex gap-x-6 text-richblack-25 hover:cursor-pointer'>
                {
                    NavbarLinks.map((link,index)=>
                         (<li key={index}>
                            {
                                link.title === "Catalog" ? (
                                    <div className='relative flex items-center gap-1 group cursor-pointer'>
                                        <p>{link.title}</p>
                                        <IoIosArrowDropdownCircle />

                                        <div className='z-10 invisible absolute left-[50%] top-[50%]
                                        -translate-x-[50%] translate-y-[100%] flex flex-col rounded-md
                                        bg-richblack p-4 text-richblack-900 opacity-0 transition-all duration-200 
                                        group-hover:visible group-hover:opacity-100 group-hover:translate-y-[10%] 
                                        lg:w-[250px] bg-richblack-5 w-[100px]'>
                                                <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45
                                                rounded bg-richblack-5 translate-x-[80%]
                                                translate-y-[-20%] '></div>
                                                <div className='flex flex-col gap-2 items-center justify-center'>
                                                    { loading ? (
                                                            <div className="w-full">
                                                            <Skeleton
                                                                count={5}
                                                                className="w-[90%] m-5 h-[15px]"
                                                                baseColor="#C5C7D4"
                                                                highlightColor="#AFB2BF"
                                                            />
                                                            </div>
                                                        ) :
                                                        ssubLinks.length ? (
                                                            ssubLinks?.map((subLink,index) => (
                                                                <Link to={`/catalog/${subLink.name
                                                                .split(" ")
                                                                .join("-")
                                                                .toLowerCase()}`}
                                                                key={index}>
                                                                    <p className='text-richblack-700
                                                                    font-medium'
                                                                    >{subLink.name}</p>
                                                                </Link>
                                                            ) )
                                                        ) 
                                                        : (<div className="text-center">No Course Found</div>)
                                                    }
                                                </div>
                                        </div>

                                    </div>
                                    ) :
                                 (<Link to={link?.path}>
                                    <p className={`${matchRoute(link?.path) ? "active" : "text-white"}`}>{link.title}
                                     </p>
                                 </Link>)
                            }
                         </li>)
                    )
                }
            </ul>
        </nav>

        {/* Login/Signup/Dashboard */}
        <div className='lg:flex gap-x-5 items-center hidden'>

                {
                    user && user?.accounType !== 'Instructor' && (
                        <Link to="/dashboard/cart" className='relative text-richblack-25'>
                        <FiShoppingCart size={22} />
                            {
                                totalItems > 0 && (
                                    <span className='absolute -top-2 left-3 text-xs'>
                                        <div className='bg-caribbeangreen-600 px-[6px] rounded-[50%]'>
                                        {totalItems}
                                        </div>
                                    </span>
                                )
                            }
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to="/login">
                            <button className={`border border-richblack-600 bg-richblack-800 rounded-md
                            text-richblack-100 px-2 py-1 ${
                            searchOpen ? "absolute -translate-y-[100px] right-[300px] top-1" : 
                            "static translate-y-0"
                            } transition-all duration-200`}>
                                Log in
                            </button>
                        </Link>
                    )
                }

                {
                    token === null && (
                        <Link to="/signup">
                            <button className={`border border-richblack-600 bg-richblack-800 rounded-md
                            text-richblack-100 px-2 py-1 ${
                                searchOpen ? "absolute -translate-y-[100px] right-[200px] top-1" : "translate-y-0 static"
                                } transition-all duration-500`}>
                                Sign up
                            </button>
                        </Link>
                    )
                }

                <SearchWeb
                    searchOpen={searchOpen}
                    setSearchOpen={setSearchOpen}
                    subLinks={ssubLinks}
                />

                {
                    token !== null && (
                        <ProfileDropDown></ProfileDropDown>
                    )
                }

        </div>

        {/* Mobile navabr */}
        <nav
          className={`inline-block lg:hidden ${searchOpen ? "hidden" : ""}`}
          ref={ref}
        >
          <NavMobile
            loading={loading}
            subLinks={ssubLinks}
            matchRoute={matchRoute}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </nav>

      </div>
    </div>
  )
}

export default Nav
