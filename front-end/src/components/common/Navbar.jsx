import React, { useEffect, useState } from 'react'
import {Link, matchPath, useLocation} from 'react-router-dom'
import logo from '../../assets/images/code mitra.png';
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
                    <li><Link to={"/categories"}><p className={`${matchRoute("/categories")?"text-yellow":""} flex gap-1 items-center`}>Courses <ChevronDown strokeWidth={1} size={20} className='font-bold'/></p></Link></li>
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