import React, { useEffect, useState } from 'react'
import {Link, matchPath, useLocation} from 'react-router-dom'
// import logo from '../../assets/logo/dark logo.gif';
// import logo from 'https://res.cloudinary.com/ddsumlfnv/image/upload/v1727219518/light-logo_iikf2z.gif';
import {useSelector} from 'react-redux'
import ProfileDropdown from '../Core/Auth/ProfileDropdown';
import { apiConnector } from '../../services/apiConnectors';
import { categories } from '../../services/apis';
import { BicepsFlexed, ChartNoAxesCombined, ChevronDown, Code, House, LogIn, LogOut, NotebookPen, Shapes, ShoppingCart, TabletSmartphone, Trophy, VenetianMask } from 'lucide-react';
import { setLoading } from '../../slice/AuthSlice';
import Spinner from './Spinner';
const Navbar = () => {
    const [loading, setLoading] = useState(false)
    const {token}=useSelector((state)=>state.auth);
    const {user}=useSelector((state)=>state.profile)
    const {totalItems}=useSelector((state)=>state.cart)
    const [subLinks,setSubLinks]=useState([])

    useEffect(()=>{
        const fetchSubLinks=async()=>{
            try {
                setLoading(true)
                const result=await apiConnector('GET',categories.CATEGORIES_API);
                // console.log(result.data.data);
                setSubLinks(result.data.data)
                setLoading(false)
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
    <div className='flex h-14  items-center sticky top-0 border-b-blue font-bold w-full border-b-2 bg-black  ' >
        <div className='flex  w-full justify-between items-center mx-4'>
        {/* image */}
            <Link path="/" className="">
                <img src="https://res.cloudinary.com/ddsumlfnv/image/upload/v1727219519/dark-logo_i8zage.gif" alt="logo" loading='lazy' width={150} />
            </Link>
            {/* nav links */}
            <nav>
                <ul className='flex flex-row gap-6'>
                    <li><Link to={"/"}><p className={`${matchRoute("/")?"text-blue":""} flex gap-1 items-center`}><House size={20}/>Home</p></Link></li>
                    <div className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/courses/:catalogName")
                          ? "text-blue"
                          : "text-black"
                      }`}> 
                                <p className={`flex items-center text-white`} >Courses <ChevronDown/></p>

                                <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg p-4 text-white opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] border-blue border-2 border-t-white backdrop-blur-sm bg-black'>

                                <div className='absolute left-[50%]  -top-3 h-6 w-6 rotate-45 select-none rounded border-t-2 border-l-2 bg-black '>
                                </div>
                                {loading?(
                                    <div>Loading..</div>
                                ):
                                 subLinks.length>0 ? (
                                        subLinks.map( (subLink, index) => (
                                                <Link to={`courses/${subLink.name.split(" ").join("-").toLowerCase()}`} key={index} className='rounded-lg bg-transparent py-2 pl-2 hover:bg-blue hover:text-black'>
                                                    <p>{subLink.name}</p>
                                                </Link>
                                            ) )
                                    ) : (<div>No Courses Found</div>)
                            }
                                </div>


                            </div>
                    <li><Link to={"/compiler"}><p className={`${matchRoute("/compiler")?"text-blue":""} flex gap-1 items-center`}><Code size={20}/>Compiler</p></Link></li>
                    <li><Link to={"/practice"}><p className={`${matchRoute("/practice")?"text-blue":""} flex gap-1 items-center`}><Trophy  size={20}/>Practice</p></Link></li>
                    <li><Link to={"/notes"}><p className={`${matchRoute("/notes")?"text-blue":""} flex gap-1 items-center`}><NotebookPen size={20}/>Notes</p></Link></li>
                    <li><Link to={"/jobs"}><p className={`${matchRoute("/jobs")?"text-blue":""} flex gap-1 items-center`}><ChartNoAxesCombined  size={20}/>Jobs</p></Link></li>
                </ul>
            </nav>

            {/* login/signup */}
            <div className=" flex gap-4 ">
                {
                   user&&user?.accountType !=="Instructor" && (
                    <Link to="/dashboard/cart" className='relative '>
                        <ShoppingCart/> {
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
                            <button className={`border-blue border-2 p-1 rounded-md ${matchRoute("login")?"bg-blue text-black":""} flex gap-1`}>Log In</button>
                        </Link>
                    )
                }
                {
                    token===null && (
                        <Link to={'/signup'}>
                            <button className={`border-blue border-2 p-1 rounded-md ${matchRoute("signup")?"bg-blue text-black":""} flex gap-1`}>Sign up</button>
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