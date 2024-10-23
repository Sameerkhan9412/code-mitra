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
import UpdatePassword from "./pages/UpdatePassword";
import OpenRoute from "./components/Core/Auth/OpenRoute";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/Core/Auth/PrivateRoute";
import EnrolledCourses from "./components/Core/Dashboard/EnrolledCourses";
import Settings from "./components/Core/Dashboard/Settings";
import PurchaseHistory from "./components/Core/Dashboard/PurchaseHistory";
import Cart from "./components/Core/Dashboard/Cart";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/Core/Dashboard/AddCourse";
import Catalog from "./pages/Catalog";

export default function App() {
  const { user } = useSelector((state) => state.profile)
  return (
    <div className="App bg-black text-white min-h-screen relative">
      <Toaster/>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/courses/:catalogName" element={<Catalog/>} />
        <Route path="/compiler" element={<Compiler/>}/>
        <Route path="/practice" element={<Practice/>}/>
        <Route path="/notes"  element={<Notes/>}/>
        <Route path="/jobs"  element={<Job/>}/>
        <Route path="/login"  element={<OpenRoute><Login/></OpenRoute>}/>
        <Route path="/signup"  element={<OpenRoute><Signup/></OpenRoute>}/>
        <Route path="/verify-email"  element={<OpenRoute><VerifyEmail/></OpenRoute>}/>
        <Route path="/forgot-password"  element={<OpenRoute><ForgetPassword/></OpenRoute>}/>
        <Route path="/update-password/:id"  element={<OpenRoute><UpdatePassword/></OpenRoute>}/>
        <Route path="/dashboard"  element={<PrivateRoute><Dashboard/></PrivateRoute>}>
          <Route path="my-profile" element={<MyProfile/>}/>
          <Route path="enrolled-courses" element={<PrivateRoute><EnrolledCourses/></PrivateRoute>}/>
          <Route path="purchase-history" element={<PrivateRoute><PurchaseHistory/></PrivateRoute>}/>
          <Route path="settings" element={<PrivateRoute><Settings/></PrivateRoute>}/>
          <Route path="cart" element={<PrivateRoute><Cart/></PrivateRoute>}/>
        {
        user?.accountType === ACCOUNT_TYPE.STUDENT && (
          <>
          <Route path="cart" element={<Cart />} />
          <Route path="enrolled-courses" element={<EnrolledCourses />} />
          </>
        )
      }

        {
        user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
          <>
          {/* <Route path="dashboard/instructor" element={<Instructor />} /> */}
          <Route path="add-course" element={<AddCourse/>} />
          {/* <Route path="dashboard/my-courses" element={<MyCourses />} /> */}
          {/* <Route path="dashboard/edit-course/:courseId" element={<EditCourse />} /> */}
          </>
        )
      }
        </Route>
        
        <Route path="/contact"  element={<Contact/>}/>
        <Route path="/about"  element={<About/>}/>


      </Routes>
    </div>
  )
}