import loginImg from "../assets/images/login.gif"
import Template from "../components/Core/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description="Sign In to Code, Learn, and Grow"
      image={loginImg}
      formType="login"
    />
  )
}

export default Login