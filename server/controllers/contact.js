const Contact = require("../models/contact");
const  mailSender  = require("../utils/mailSender");
const {contactUsTemp} = require("../mail/templates/contactUsTemp")

//creating contact handler
exports.contact = async (req, res) => {
  try {
    //getting data from req.body
    const {countrycode,email, firstName, lastName, message, phoneNo } =
      req.body;

    //validate
    if (!firstName || !email || !phoneNo || !message) {
      return res.status(400).json({
        success: false,
        message: "All fileds are needed",
      });
    }
    const processedLastName = lastName ? lastName : "";
  
    //saving data in db
    const contactDetails = await Contact.create({
      firstName: firstName,
      lastName: processedLastName,
      email: email,
      phoneNumber: `${countrycode}-${phoneNo}`,
      message: message,
    });

    if (!contactDetails) {
      return res.status(400).json({
        success: false,
        message: "contact details are not found",
      });
    }

    const mailSendToUser = await mailSender(
      contactDetails.email,
      "Your Feedback Has Sent Successfully",
      contactUsTemp(contactDetails)
    );

    if(!mailSendToUser){
      return res.status(400).json({
        success: false,
        message: "Mail to user is not send Successfully",
      });
    }

    const mailSendToMe = await mailSender(
      `Ahmarfaraz9@gmail.com`,
      "You got a Response!!",
      contactUsTemp(contactDetails)
    );

    //return respones
    res.status(200).json({
      success: true,
      message: "Conatct me Details create successfully",
      data: contactDetails,
    });
  } catch (error) {
    console.log("Error in conatcus handler", error.message)
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    })
  }
};