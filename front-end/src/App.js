import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Navbar from "./components/common/Navbar";
import Compiler from "./pages/Compiler";
import Practice from "./pages/Practice";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import MyProfile from "./components/Core/Dashboard/MyProfile";

export default function App() {
  return (
    <div className=" bg-black text-white min-h-screen">
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/compiler" element={<Compiler/>}/>
        <Route path="/practice" element={<Practice/>}/>
        <Route path="/login"  element={<Login/>}/>
        <Route path="/signup"  element={<Signup/>}/>
        <Route path="/verify-email"  element={<VerifyEmail/>}/>
        <Route path="/dashboard/my-profile"  element={<MyProfile/>}/>
        
        <Route path="/contact"  element={<Contact/>}/>
        <Route path="/about"  element={<About/>}/>



      </Routes>
    </div>
  )
}