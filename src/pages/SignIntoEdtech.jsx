import signupImg from "../assets/Images/signup.webp"
import Templatee from '../components/core/Auth/Templatee';

const SignIntoEdtech = () => {
    return (
        <Templatee
          title="Join the millions learning to code with StudyNotion for free"
          description1="Build skills for today, tomorrow, and beyond."
          description2="Education to future-proof your career."
          image={signupImg}
          formType="signup"
        />
      )
};

export default SignIntoEdtech;
