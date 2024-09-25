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
import Notes from "./pages/Notes";
import Job from "./pages/Jobs";
import Spinner from "./components/common/Spinner";
import './App.css'
import { Toaster } from "react-hot-toast";
import ForgetPassword from "./pages/ForgetPassword";

export default function App() {
  return (
    <div className="App bg-black text-white min-h-screen">
      <Toaster/>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/compiler" element={<Compiler/>}/>
        <Route path="/practice" element={<Practice/>}/>
        <Route path="/practice" element={<Practice/>}/>
        <Route path="/notes"  element={<Notes/>}/>
        <Route path="/jobs"  element={<Job/>}/>
        <Route path="/login"  element={<Login/>}/>
        <Route path="/signup"  element={<Signup/>}/>
        <Route path="/verify-email"  element={<VerifyEmail/>}/>
        <Route path="/forget-password"  element={<ForgetPassword/>}/>
        <Route path="/dashboard/my-profile"  element={<MyProfile/>}/>
        
        <Route path="/contact"  element={<Contact/>}/>
        <Route path="/about"  element={<About/>}/>



      </Routes>
    </div>
  )
}