import loginImg from "../assets/Images/login.webp"
import Templatee from "../components/core/Auth/Templatee"

const LogEntry = () => {
  return (
    <Templatee
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
    />
  )
};

export default LogEntry;
