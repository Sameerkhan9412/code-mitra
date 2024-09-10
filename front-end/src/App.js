import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Navbar from "./components/common/Navbar";

export default function App() {
  return (
    <div>
        <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        
        <Route path="/contact"  element={<Contact/>}/>
        <Route path="/about"  element={<About/>}/>
        
      </Routes>
    </div>
  )
}