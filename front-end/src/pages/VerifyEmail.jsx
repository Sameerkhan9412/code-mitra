import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { Link,useNavigate } from "react-router-dom";
import { ArrowBigLeft } from "lucide-react";
import Spinner from "../components/common/Spinner";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signupData;
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };
  return(
  <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
    {loading ? (
     <Spinner/>
    ) : (
      <div className="max-w-[500px] p-4 lg:p-8">
        <h1 className="text-white font-semibold text-[1.875rem] leading-[2.375rem]">Verfiy Email</h1>
        <p className="text-[1.125rem] leading-[1.625rem] my-4 text-white">
          A verfication code has been sent to you . Enter the code below
          </p>
        <form onSubmit={handleOnSubmit}>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span>-</span>}
            renderInput={(props) =>
               <input {...props} className="w-[48px] lg:w-[60px] bg-black rounded-[0.5rem] text-white aspect-square text-center  focus:border-0  focus:outline-blue text-2xl border-2 border-blue" placeholder="-" style={{
                boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
               }}
               containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
               
               />
              }
          />
          <button type="submit" className="w-full bg-blue py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-white">Verify Email</button>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className=" flex items-center gap-x-2 text-blue">
            <ArrowBigLeft />Back to Login
            </p>
          </Link>
        </div>
        <button onClick={() => dispatch(sendOtp(signupData.email,navigate))} className="flex items-center text-blue gap-x-2">
          Resend It
        </button>
        <span className='text-red-600 '>please check spam folder if you not recieve an mail.</span>

      </div> 
      
    )}
 </div>
);
}
export default VerifyEmail;