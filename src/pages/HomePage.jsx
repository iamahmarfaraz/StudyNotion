import React, { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./HomePage.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlockk from "../components/core/HomePage/CodeBlockk";
import Footer from "../components/common/Footer";
import TimelineComp from "../components/core/HomePage/TimelineComp";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import ThreeDbutton from "../components/common/ThreeDbutton";
import Instructor from "../components/core/HomePage/Instructor";
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider";
import { useSelector } from "react-redux";
import { apiConnector } from "../services/apiconnector";
import { ratingsEndpoints } from "../services/apis";
import { ACCOUNT_TYPE } from "../utils/constants";




const HomePage = () => {
  useGSAP(() => {
    gsap.to(".bcm-gsap", { opacity: 1, delay: 0.2, ease: "power1.out" });
    gsap.to(".cta", { opacity: 1, y: 10, delay: 0.4, ease: "power1.out" });

    gsap.to("#Hero-L1", {
      opacity: 1,
      x: 10,
      delay: 0.7,
      ease: "power2.inOut",
      duration: 1,
    });
    gsap.to("#Hero-L2", {
      opacity: 1,
      x: 8,
      delay: 1.2,
      ease: "power2.inOut",
      duration: 1,
    });
    gsap.to(".btn-gsap", { opacity: 1, y: 10, delay: 1.6, ease: "power1.out" });
    gsap.to(".vdeo", { opacity: 1, y: -10, delay: 2, ease: "power1.out" });
    gsap.to(".video-zoom", {
      delay: 2.2,
      duration: 1.3,
      scale: 1.2,
      ease: "power1.out",
    });
    
  }, []);

  const { user } = useSelector((state) => state.profile);

  // DATA for reviews Slider
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fecthAllReviews = async () => {
      try {
        const response = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );

        if (response) {
          if (!response.data.success) {
            throw new Error(response.data.message);
          }
          setReviews(response?.data?.data);
          // console.log("REVIEWS_DETAILS_API RESPONSE.....",response)
        }
      } catch (error) {
        console.log("ERROR IN GETTING ALL REVIEWS....", error);
      }
    };

    fecthAllReviews();
  }, []);

  return (
    <div>
      {/* Section 1 */}
      <div
        className="relative mx-auto flex flex-col w-11/12 items-center 
    text-white justify-between max-w-maxContent"
      >
        <Link to={"/signup"}>
          <div
            className="mt-16 btn mx-auto text-richblack-100 transition-all duration-500 hover:scale-95
          w-fit bcm-gsap opacity-0"
          >
            <div className="flex gap-2 items-center">
              <p>Become an Instructor</p>
              <FaArrowRight className=""></FaArrowRight>
            </div>
          </div>
        </Link>

        <div
          className="mt-11 cta opacity-0 -translate-y-10 text-center text-4xl
        font-semibold"
        >
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        <div className="mt-8 w-[90%] text-center items-center font-bold text-lg text-richblack-300  ">
          <p id="Hero-L1" className="opacity-0 -translate-x-10">
            With our online coding courses, you can learn at your own pace, from
            anywhere in the world, and get access to a{" "}
          </p>
          <p id="Hero-L2" className="opacity-0 translate-x-10">
            wealth of resources, including hands-on projects, quizzes, and
            personalized feedback from instructors.
          </p>
        </div>

        <div className="flex flex-row gap-7 mt-8 btn-gsap opacity-0 translate-y-50">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>

          <CTAButton active={false} linkto={"/login"}>
            Book a Demo
          </CTAButton>
        </div>

        <div
          className="mx-3 my-14 shadow-blue-100 shadow-[10px_-5px_80px_-5px] vdeo translate-y-10
         opacity-0"
        >
          <div className="overflow-hidden shadow-[20px_20px_rgba(255,255,255)]">
            <video muted loop autoPlay className=" video-zoom">
              <source src={Banner} type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Code - section - 1 */}
        <div className="">
          <CodeBlockk
            position={"lg:flex-row flex-col"}
            heading={
              <div className="text-4xl font-semibold">
                Unlock Your
                <HighlightText text={"coding potential"}></HighlightText> with
                our online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            backgroundGradient={"codeblock1"}
            codeblock={`<<!DOCTYPE html>\n<html>\n<head><title>Example</title><linkrel="stylesheet"\nhref="styles.css"></head>\n<body>\n<h1><a href="/">Header</a>\n</h1>\n<nav><a href="/one">One</a>\n</nav>`}
            codeColor={"text-yellow-25"}
          ></CodeBlockk>
        </div>

        {/* Code - section - 2 */}
        <div className="">
          <CodeBlockk
            position={"lg:flex-row-reverse flex-col"}
            heading={
              <div className="text-4xl font-semibold">
                Start
                <HighlightText text={"Start coding in seconds"}></HighlightText>
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn more",
              linkto: "/login",
              active: false,
            }}
            backgroundGradient={"codeblock2"}
            codeblock={`#include<iostream>\nusing namespace std;\n\nint add(int a, int b) {\n    return a + b;\n}\nint main() {\n    int x = 10, y = 20;\n    cout << "Sum: " << add(x, y) << endl;\n    return 0;\n}`}
            codeColor={"text-caribbeangreen-50"}
          ></CodeBlockk>
        </div>

        <ExploreMore/>

      </div>

      {/* Section 2 */}
      <div className="bg-pure-greys-5 bg-gradient-to-black text-richblack-700">
        <div className="homepage_bg h-[320px]">
          <div
            className="w-11/12 h-full max-w-maxContent flex flex-col items-center justify-between
               gap-5 mx-auto"
          >
            <div className="h-[50px]"></div>

            <div className="flex flex-row gap-7 lg:mb-10 mb-32 text-white">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight></FaArrowRight>
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={"/signup"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>

          
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7">

          <div className="flex flex-col items-center lg:flex-row gap-5 mb-10 mt-[95px] justify-between">

            <div className="text-4xl font-semibold lg:w-[45%]">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>

            <div className="flex flex-col gap-10 lg:w-[40%] items-start">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              {/* <CTAButton active={true} linkto={"/signup"}>
                <div>Learn more</div>
              </CTAButton> */}
                <ThreeDbutton linkto={"/signup"}>Learn More</ThreeDbutton>
            </div>

          </div>

          <TimelineComp></TimelineComp>

          <LearningLanguageSection />

        </div>

      </div>

      {/* Section 3 */}
      <div className="h-[100px] bg-fade-gradient"></div>
      <div className="w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8">

          

          <Instructor></Instructor>

          <h2 className="text-center text-richblack-5 font-semibold text-4xl mt-16">Reviews from Other Learners</h2>
          <ReviewSlider reviews={reviews} />

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
