import signupImg from "../assets/images/signup.gif"
import Template from "../components/Core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Unlock Your Development Potential "
      description="– Join Today to Start Building, Learning, and Growing Your Developer Skills! "
      image={signupImg}
      formType="signup"
      // Unlock Your Development Potential – Join Today to Start Building, Learning, and Growing Your Developer Skills!
    />
  )
}

export default Signup