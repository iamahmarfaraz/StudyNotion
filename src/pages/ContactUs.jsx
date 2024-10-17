import React, {useState, useEffect} from "react";
import ContactFormSection from "../components/core/ContactPage/ContactFormSection";
import ReviewSlider from "../components/common/ReviewSlider";
import Footer from "../components/common/Footer";
import InfoSection from "../components/core/ContactPage/InfoSection";
import { apiConnector } from "../services/apiconnector";
import { ratingsEndpoints } from "../services/apis";

const ContactUs = () => {

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
            console.log("Review Data :- ",response);
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
    <div className="mt-14">
    
        {/* Section 1 */}
        <section className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        <InfoSection/>
        <ContactFormSection />
        </section>

        {/* Section 2 */}
        <section className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        <h1 className="text-center text-4xl font-semibold mt-8">
            Reviews from other learners
        </h1>
        <ReviewSlider reviews={reviews}/>
        </section>

        {/* Section 3 */}
        <section>
        <Footer />
        </section>
    </div>
  )
}

export default ContactUs
