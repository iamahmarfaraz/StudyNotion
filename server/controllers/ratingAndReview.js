const RatingAndReview = require("../models/ratingAndReview");
const Course = require("../models/course");
const { default: mongoose } = require("mongoose");


// create Rating
exports.createRating = async (req,res) => {
    try {
        
        // get userId
        const userId = req.user.id;

        // fetch data from req body
        const {rating,review,courseId} = req.body;

        // check if user is enrolled for that course
        const courseDetails = await Course.findOne({_id:courseId,studentsEnrolled:userId});
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"User Haven't bought the course yet or Course invalid"
            })
        }

        // check if user already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({user:userId,course:courseId});
        if (alreadyReviewed) {
            return res.status(403).json({
                success:false,
                message: "User already reviewed this course",
            });
        }

        // create rating and review
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course:courseId,
            user:userId,
        });

        // attach the course with this new rating and review
        await Course.findByIdAndUpdate({_id:courseId},
            {$push:{ratingAndReviews:ratingReview._id}},
            {new:true}
        );

        // return response
        return res.status(200).json({
            success:true,
            message:"Rating Creation successfull"
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Rating Creation Failed"
        })
    }
}


// get Average Rating
exports.getAverageRating = async (req,res) => {
    try {
        
        // get courseId
        const courseId = req.body.courseId;

        // calculate average rating
        const result = await RatingAndReviewingAndReview.aggregate([
            {
                $match:{course: new mongoose.Types.ObjectId(courseId)}
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg:"$rating"},
                }
            }
        ])

        // return response
        if (result.length > 0) {
            return res.status(200).json({
                success:true,
                message:"Got the Average Rating",
                averageRating : result[0].averageRating,
            })
        }
        else{
            return res.status(200).json({
                success:true,
                message:"No Rating till now",
                averageRating:0,
            })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


// get All RatingsAndReviews
exports.getAllRating = async (req,res) => {
    try {
        
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"})
        .populate({
            path:"user",
            select:"firstName lastName email image"
        })
        .populate({
            path:"course",
            select:"courseName"
        }).exec();

        return res.status(200).json({
            success:true,
            message:"All Review fetched successfully",
            data:allReviews,
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// get all RatingAndReview corresponding to a Course - HW
exports.getAllRatingOfCourse = async (req,res) => {
    try {
        
        // fetch courseId from req body
        const {courseId} = req.body;

        // validation
        if (!courseId) {
            return res.status(400).json({
                success:false,
                message:"CourseId didn't provided",
            });
        }

        // populate ratingAndReview in courseDetails or just fetch all the ratingAndReview object based
        // on the courseId
        const courseDetails = await Course.findById({_id:courseId}).populate("ratingAndReviews").exec();
        if (!courseDetails) {
            return res.status(404).json({
                success:false,
                message:"Course Invalid",
            })
        }

        // Return Response
        return res.status(200).json({
            success:true,
            message:"Fetched all the Rating And Review of the Course",
            data : courseDetails.ratingAndReviews,
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}