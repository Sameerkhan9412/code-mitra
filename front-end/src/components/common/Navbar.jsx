import React, { useEffect, useState } from 'react'
import {Link, matchPath, useLocation} from 'react-router-dom'
import logo from '../../assets/logo/dark logo.gif';
import { NavbarLinks } from '../../data/navbar-links';
import {useSelector} from 'react-redux'
import ProfileDropdown from './Auth/ProfileDropdown';
import { apiConnector } from '../../services/apiConnectors';
import { categories } from '../../services/apis';
import { BicepsFlexed, ChevronDown, Code, House, LogIn, LogOut, Shapes, TabletSmartphone, VenetianMask } from 'lucide-react';
const Navbar = () => {
    const {token}=useSelector((state)=>state.auth);
    const {user}=useSelector((state)=>state.profile)
    const {totalItems}=useSelector((state)=>state.cart)
    const [subLinks,setSubLinks]=useState([])

    useEffect(()=>{
        const fetchSubLinks=async()=>{
            try {
                const result=await apiConnector('GET',categories.CATEGORIES_API);
                console.log(result.data.data);
                setSubLinks(result.data.data)
            } catch (error) {
                console.log("Could fetch the category list")
            }
        }
        fetchSubLinks();
    },[])

    const location=useLocation();
    const matchRoute=(route)=>{
        return matchPath({path:route},location.pathname)
    }
  return (
    <div className='flex h-14  items-center  border-b-yellow font-bold w-full border-b-2' >
        <div className='flex  w-full justify-between items-center mx-4'>
        {/* image */}
            <Link path="/" className="">
                <img src={logo} alt="logo" width={120} />
            </Link>
            {/* nav links */}
            <nav>
                <ul className='flex flex-row gap-6'>
                    <li><Link to={"/"}><p className={`${matchRoute("/")?"text-yellow":""} flex gap-1 items-center`}><House size={20}/>Home</p></Link></li>
                    {/* <li><Link to={"/categories"}><p className={`${matchRoute("/categories")?"text-yellow":""} flex gap-1 items-center`}>Courses <ChevronDown strokeWidth={1} size={20} className='font-bold'/></p></Link></li> */}
                    <div className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/courses/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}> 
                                <p>Courses</p>

                                <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] border-yellow border-2 border-t-white'>

                                <div className='absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5'>
                                </div>
                                {0?(
                                    // <Spinner/>
                                    <div>loading...</div>
                                ):
                                 subLinks.length>0 ? (
                                        subLinks.map( (subLink, index) => (
                                                <Link to={`catalog/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index} className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50'>
                                                    <p>{subLink.name}</p>
                                                </Link>
                                            ) )
                                    ) : (<div>No Courses Found</div>)
                            }
                                </div>


                            </div>
                    <li><Link to={"/compiler"}><p className={`${matchRoute("/compiler")?"text-yellow":""} flex gap-1 items-center`}><Code size={20}/>Compiler</p></Link></li>
                    <li><Link to={"/practice"}><p className={`${matchRoute("/practice")?"text-yellow":""} flex gap-1 items-center`}><BicepsFlexed size={20}/>Practice</p></Link></li>
                    <li><Link to={"/about"}><p className={`${matchRoute("/about")?"text-yellow":""} flex gap-1 items-center`}><VenetianMask size={20}/>About us</p></Link></li>
                    <li><Link to={"/contact"}><p className={`${matchRoute("/contact")?"text-yellow":""} flex gap-1 items-center`}><TabletSmartphone size={20}/>Contact us</p></Link></li>
                </ul>
            </nav>

            {/* login/signup */}
            <div className=" flex gap-4 ">
                {
                   user&&user?.accountType !=="Instructor" && (
                    <Link to="/dashboard/cart" className='relative '>
                        cart {
                            totalItems>0 && (
                                <span>{totalItems}</span>
                            )
                        }
                    </Link>
                   )
                }
                {
                    token===null && (
                        <Link to={'/login'}>
                            <button className={`border-yellow border-2 p-1 rounded-md ${matchRoute("login")?"bg-yellow text-black":""} flex gap-1`}>Log In</button>
                        </Link>
                    )
                }
                {
                    token===null && (
                        <Link to={'/signup'}>
                            <button className={`border-yellow border-2 p-1 rounded-md ${matchRoute("signup")?"bg-yellow text-black":""} flex gap-1`}>Sign up</button>
                        </Link>
                    )
                }
                {
                    token!==null && <ProfileDropdown/>
                }
            </div>
        </div>
    </div>
  )
}

export default Navbar