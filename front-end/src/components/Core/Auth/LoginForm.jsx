import { useState } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { login } from "../../../services/operations/authAPI"
import { Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
    // console.log("i am handle submit")
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white">
          Email Address <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-black p-[12px] text-white outline-none"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-white ">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          style={{
            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
          }}
          className="w-full rounded-[0.5rem] bg-black p-[12px] pr-12 text-white outline-none"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        >
          {showPassword ? (
            <Eye fontSize={24} />
          ) : (
            <EyeOff fontSize={24}/>
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label>
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-blue-50 py-[8px] px-[12px] font-medium text-black bg-blue"
      >
        Sign In
      </button>
      <button
        type=""
        className="mt-6 rounded-[8px] bg-blue-50 py-[8px] px-[12px] font-medium text-black bg-blue"
      >
        Sign 
      </button>
    </form>
  )
}

export default LoginForm