const Section = require("../models/section");
const Course = require("../models/course"); 

exports.createSection = async (req, res) => {
	try {
		// Extract the required properties from the request body
		const { sectionName, courseId } = req.body;

		// Validate the input
		if (!sectionName || !courseId) {
			return res.status(400).json({
				success: false,
				message: "Missing required properties",
			});
		}

		// Create a new section with the given name
		const newSection = await Section.create({ sectionName });

		// Add the new section to the course's content array
		const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
        ).populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          }).exec();
        console.log("Updated Course :- ",updatedCourse);

		// Return the updated course object in the response
		res.status(200).json({
			success: true,
			message: "Section created successfully",
			updatedCourse,
		});
	} catch (error) {
		// Handle errors
		res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

// UPDATE a section
exports.updateSection = async (req, res) => {
    try {
      const { sectionName, sectionId, courseId } = req.body;
      const section = await Section.findByIdAndUpdate(
        sectionId,
        { sectionName },
        { new: true }
      );
  
      //findding course
      const course = await Course.findById(courseId).populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });
      res.status(200).json({
        success: true,
        message: "Section is updated Successfully",
              data:course
      });
    } catch (error) {
      console.error("Error updating section:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

exports.deleteSection = async (req, res) => {
    try {
        // Get sectionId and courseId from request

        //real wala
        // const {sectionId} = req.params;
        // console.log("Section Id : - ",sectionId);

        // testing ke liye sectionId = req.body
        const { sectionId } = req.body;  // Adjust this according to your actual input
        console.log("Section Id : - ", sectionId);
        const { courseId } = req.body;
        console.log("Course Id :- ",courseId);

        // Remove the section from the course's content
        let course = await Course.findByIdAndUpdate(
            courseId,
            { $pull: { courseContent: sectionId } }
        );

        // If the course update was not successful, handle it
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Delete the section
        const section = await Section.findByIdAndDelete(sectionId);

        // If the section deletion was not successful, handle it
        if (!section) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

         course = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          });
        // Return success response with the correct status code
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            data: course,
        });

    } catch (error) {
        console.error("Error deleting section:", error);
        return res.status(500).json({
            success: false,
            message: "Section Deletion Failed"
        });
    }
}
