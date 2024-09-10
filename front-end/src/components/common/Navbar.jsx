import React, { useEffect, useState } from 'react'
import {Link, matchPath, useLocation} from 'react-router-dom'
import logo from '../../assets/images/code mitra.png';
import { NavbarLinks } from '../../data/navbar-links';
import {useSelector} from 'react-redux'
import ProfileDropdown from './Auth/ProfileDropdown';
import { apiConnector } from '../../services/apiConnectors';
import { categories } from '../../services/apis';
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
    <div className='flex h-14  items-center  justify-center border-b-[1px] border-b-black'>
        <div className='flex w-11/12 max-w-screen-lg items-center justify-between'>
        {/* image */}
            <Link path="/">
                <img src={logo} alt="logo" height={30} width={80} />
            </Link>
            {/* nav links */}
            <nav>
                <ul className='flex flex-row'>
                    {
                        NavbarLinks.map((link,index)=>(
                            <li key={index}>
                                {
                                    link.path==="/category"?(<div>
                                        <p className=''>{link.title}</p>
                                        <div className="">
                                            {
                                                subLinks?.length>0?subLinks.map((link,index)=>(
                                                    <li><Link to={link._id}>{link.name}</Link></li>
                                                )):<p>cateogy not found</p>
                                            }
                                        </div>
                                    </div>):(
                                        <Link to={link?.path}><p className={`${matchRoute(link?.path)?"bg-red-600":"text-yellow-500"}`}>{link.title}</p></Link>
                                    )
                                }
                            </li>
                        ))
                    }
                </ul>
            </nav>

            {/* login/signup */}
            <div className=" flex gap-4 ">
                {
                   user&&user?.accountType !="Instructor" && (
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
                            <button>Log In</button>
                        </Link>
                    )
                }
                {
                    token===null && (
                        <Link to={'/signup'}>
                            <button>Sign up</button>
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