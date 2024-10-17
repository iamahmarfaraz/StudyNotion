const Category = require("../models/category");

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }


// Create TAG ka Handler func
exports.createCategory = async (req,res) => {
    try {
        
        // Fetch Data from Request Body
        const {name,description} = req.body;

        // Validation
        if (!name || !description) {
            return res.status(400).json({
                success:false,
                message:"All Fields are required "
            });
        }

        // check if that category already exist 
        const checkCategory = await Category.findOne({name:name});
        if (checkCategory) {
            return res.status(401).json({
                success:false,
                message:"Category Already Exists"
            });
        }

        // create entry in DB
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log("Category created :- ",categoryDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        });


    } catch (error) {
        console.log("Error while creating Category :- ",error);
        return res.status(500).json({
            success:false,
            message:"Category Creation Unsuccessfull"
        });
    }
};

//Editing a category
exports.updateCategory = async (req, res) => {
    try {
      const { categoryId, name, description } = req.body;
      const CategorysDetails =  await Category.findById(categoryId);
      if(!CategorysDetails){
        return res
        .status(400)
        .json({ success: false, message: `Cannot find Category with Id ${categoryId}` });
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(
        { _id: categoryId },
        {
          name: name || CategorysDetails.name,
          description: description || CategorysDetails.description,
  
        }
      );
  
      res.status(200).json({
        success: true,
        data: updatedCategory,
        message: `Updated Successfully`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message,
        message: "Server Error",
      });
    }
};
  
  //deleting a category
exports.deleteCategory = async (req, res) => {
    try {
      const { categoryId } = req.body;
      if (!categoryId) {
        return res
          .status(400)
          .json({ success: false, message: "req.body does not contain CourseId " });
      }
  
      const CategorysDetails = await Category.findById(categoryId);
      if(CategorysDetails.courses.length>0){
        return res
        .status(400)
        .json({ success: true, message: "This Category Conatin mutliple Courses" });
      }
  
     await Category.findByIdAndDelete(categoryId)
      // console.log(CategorysDetails);
      return res.status(200).json({
        success: true,
        message: "Categorys Deleted Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

// Get All category
exports.showAllCategories = async (req,res) => {
    try {
        
        const allCategory = await Category.find({},{name:true , description:true});

        // return response
        return res.status(200).json({
            success:true,
            message:"All Category returned successfully",
            data: allCategory,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    //get categoryId
    const { categoryId } = req.body;
    console.log("Category Id:- ",categoryId);
    //get courses for specified categoryId
    const selectedCategory = await Category.findById(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published" },
      populate: ["ratingAndReviews", "instructor"]
    })
    .exec()

    //console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Data of that Category Not Found");
      return res.status(404).json({
        success: false,
        message: "Data Not Found",
        error,
      });
    }

    // Handle the case when there are no courses
    // if (selectedCategory.courses.length === 0) {
    //   console.log("No courses found for the selected category.");
    //   return res.status(404).json({
    //     success: false,
    //     message: "No courses found for the selected category.",
    //   });
    // }

    //get coursesfor different categories
    //*Sending Multiple categories
    // const differentCategories = await Category.find({
    //   _id: { $ne: categoryId },
    // })
    //   .populate({
    //     path: "courses",
    //     match: { status: "Published" },
    //     populate: {
    //       path: "instructor",
    //     },
    //   })
    //   .exec();

    //* Only one
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec()

    //console.log("Different COURSE", differentCategory)
    // Get top-selling courses across all categories
    //Todo: Read this
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    // console.log("mostSellingCourses COURSE", mostSellingCourses)

    //return response
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};