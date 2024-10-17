
# StudyNotion

StudyNotion is a fully functional edtech platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It enables users to create, consume, and rate educational content, providing an immersive learning experience for students and allowing instructors to showcase their expertise.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [Profile Endpoints](#profile-endpoints)
  - [Course Endpoints](#course-endpoints)
  - [Ratings and Reviews Endpoints](#ratings-and-reviews-endpoints)
  - [Category Endpoints](#category-endpoints)
  - [Contact Us Endpoint](#contact-us-endpoint)
  - [Settings Endpoints](#settings-endpoints)
  - [Search Endpoints](#search-endpoints)
- [Models](#models)
  - [User Model](#user-model)
  - [Course Model](#course-model)
  - [Category Model](#category-model)
  - [Profile Model](#profile-model)
  - [Contact Model](#contact-model)
  - [Rating and Review Model](#rating-and-review-model)
  - [OTP Model](#otp-model)
  - [Course Progress Model](#course-progress-model)
  - [Section Model](#section-model)
  - [SubSection Model](#subsection-model)
- [Frontend Features](#frontend-features)
- [Backend Features](#backend-features)
- [Frontend](#frontend)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication with OTP-based signup and login.
- User profiles with the ability to manage additional details.
- Course creation and management for instructors.
- Enrolled courses and progress tracking for students.
- Rating and reviewing system for courses.
- Contact form for inquiries and feedback.
- Admin functionalities for managing users and courses.
- Payment integration for course purchases.

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Cloud Storage**: Cloudinary (for media management)
- **Payment Gateway**: Razorpay
- **Email Service**: Nodemailer (for sending emails)
- **Twilio**: For sending SMS notifications (if applicable)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/studynotion.git
   cd studynotion
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

4. **Start the backend server:**
   ```bash
   cd backend
   npm run start
   ```

5. **Start the frontend development server:**
   ```bash
   cd frontend
   npm start
   ```

## Environment Variables

Create a `.env` file in the root of the backend directory and add the following variables:

```bash
MONGODB_URL=<your_mongodb_connection_string>
CLOUD_NAME=<your_cloudinary_cloud_name>
API_KEY=<your_cloudinary_api_key>
API_SECRET=<your_cloudinary_api_secret>
RAZORPAY_KEY=<your_razorpay_key>
RAZORPAY_SECRET=<your_razorpay_secret>
```

Also, create a `.env` file in the frontend directory:

```bash
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

## API Endpoints

## Authentication Endpoints

- `POST /auth/sendotp` - Send OTP for authentication.
- `POST /auth/signup` - User signup.
- `POST /auth/login` - User login.
- `POST /auth/reset-password-token` - Generate reset password token.
- `POST /auth/reset-password` - Reset user password.

## Profile Endpoints

- `GET /profile/getUserDetails` - Get user profile details.
- `GET /profile/getEnrolledCourses` - Get enrolled courses for the user.
- `GET /profile/userProfile` - Get instructor profile.
- `GET /profile/allUserData` - Get all users' data (Admin).
- `DELETE /profile/deleteAccountByAdmin` - Delete a user account by admin.
- `GET /profile/instructorDashboard` - Get instructor dashboard data.

## Student Endpoints

- `POST /payment/capturePayment` - Capture payment for a course.
- `POST /payment/verifyPayment` - Verify course payment.
- `POST /payment/sendPaymentSuccessEmail` - Send payment success email.

## Course Endpoints

- `GET /course/getAllCourses` - Get all courses.
- `GET /course/getCourseDetails` - Get specific course details.
- `PATCH /course/editCourse` - Edit course information.
- `GET /course/showAllCategories` - Show all course categories.
- `POST /course/createCourse` - Create a new course.
- `POST /course/addSection` - Add a section to the course.
- `POST /course/addSubSection` - Add a subsection to a section.
- `PATCH /course/updateSection` - Update section details.
- `PATCH /course/updateSubSection` - Update subsection details.
- `GET /course/getInstructorCourses` - Get all courses by the instructor.
- `DELETE /course/deleteSection` - Delete a section from the course.
- `DELETE /course/deleteSubSection` - Delete a subsection from the course.
- `DELETE /course/deleteCourse` - Delete a course.
- `GET /course/getFullCourseDetails` - Get full details of a course (authenticated).
- `POST /course/updateCourseProgress` - Update course progress (mark lecture completion).
- `POST /course/createRating` - Create a rating for a course.

## Ratings and Reviews Endpoints

- `GET /course/getReviews` - Get reviews for a course.

## Category Endpoints

- `GET /course/showAllCategories` - Get all course categories.
- `POST /course/createCategory` - Create a new course category.
- `DELETE /course/deleteCategory` - Delete a course category.
- `PATCH /course/updateCategory` - Update course category details.

## Catalog Page Data Endpoints

- `GET /course/getCategoryPageDetails` - Get catalog page data for specific categories.

## Contact Us Endpoint

- `POST /auth/contact-us` - Send a message through the contact us form.

## Settings Endpoints

- `PATCH /profile/updateDisplayPicture` - Update the user's display picture.
- `PATCH /profile/updateProfile` - Update profile details.
- `POST /auth/changepassword` - Change the user's password.
- `DELETE /profile/deleteProfile` - Delete the user's profile.
- `POST /profile/createSocial` - Add social media links to the profile.
- `PATCH /profile/updateSocial` - Update social media links.
- `DELETE /profile/deleteSocial` - Delete social media links.

## Search Endpoints

- `GET /search/getAllCourses` - Get predefined search results for courses.
- `GET /search/dropdown` - Get search suggestions based on a query.
- `GET /search` - Perform a full search for courses.


## Models

# Models for StudyNotion Application

### User Model
- **id**: Unique identifier for the user.
- **firstName**: First name of the user.
- **lastName**: Last name of the user.
- **email**: User email (used for login).
- **password**: Hashed password.
- **accountType**: Role of the user (Admin, Student, Instructor).
- **active**: Boolean indicating if the user is active.
- **approved**: Boolean indicating if the user is approved.
- **additionalDetails**: ID linking to the user's profile.
- **courses**: List of course IDs the user is enrolled in.
- **image**: Profile picture URL.
- **token**: Token for session management.
- **resetPasswordExpires**: Date indicating when the reset token expires.
- **courseProgress**: List of course progress IDs.

---

### Course Model
- **id**: Unique identifier for the course.
- **courseName**: Title of the course.
- **courseDescription**: Brief description of the course content.
- **instructor**: ID of the instructor who created the course.
- **whatYouWillLearn**: Information on what students will learn.
- **courseContent**: List of section IDs.
- **ratingAndReviews**: List of rating and review IDs.
- **price**: Cost of the course.
- **thumbnail**: URL of the course thumbnail.
- **category**: ID of the category the course belongs to.
- **tag**: List of tags associated with the course.
- **studentsEnrolled**: List of enrolled student IDs.
- **instructions**: Additional instructions for the course.
- **status**: Status of the course (Draft, Published).
- **createdAt**: Date the course was created.
- **language**: Language of the course.
- **level**: Difficulty level of the course.

---

### Category Model
- **id**: Unique identifier for the category.
- **name**: Name of the category.
- **description**: Description of the category.
- **courses**: List of course IDs in this category.

---

### Profile Model
- **id**: Unique identifier for the profile.
- **gender**: Gender of the user.
- **dateOfBirth**: Date of birth of the user.
- **about**: Short bio or description of the user.
- **contactNumber**: Contact number of the user.

---

### Contact Model
- **id**: Unique identifier for the contact message.
- **firstName**: First name of the person contacting.
- **lastName**: Last name of the person contacting.
- **email**: Email of the person contacting.
- **phoneNumber**: Phone number of the person contacting.
- **message**: Message content from the contact form.

---

### Rating and Review Model
- **id**: Unique identifier for the rating and review.
- **user**: ID of the user who submitted the rating/review.
- **rating**: Numeric rating for the course.
- **review**: Text review of the course.
- **course**: ID of the course the review is associated with.

---

### OTP Model
- **id**: Unique identifier for the OTP.
- **email**: Email address the OTP is associated with.
- **otp**: One-time password (OTP).
- **createdAt**: Date the OTP was created.
- **expiresIn**: Time until the OTP expires (5 minutes).

---

### Course Progress Model
- **id**: Unique identifier for the course progress.
- **courseID**: ID of the course being tracked.
- **userId**: ID of the user making progress.
- **completedVideos**: List of completed subsection IDs.

---

### Section Model
- **id**: Unique identifier for the section.
- **sectionName**: Title of the section.
- **subsection**: List of subsection IDs.

---

### SubSection Model
- **id**: Unique identifier for the subsection.
- **title**: Title of the subsection.
- **timeDuration**: Duration of the video or content.
- **description**: Description of the subsection content.
- **videoUrl**: URL of the video for the subsection.
- **createdAt**: Date the subsection was created.


---

## Frontend Features

The frontend of StudyNotion is built with React and Tailwind CSS, offering a seamless user experience. Key features include:

### 1. **User Authentication**
   - **Signup**: Users can create accounts using their email and an OTP verification process.
   - **Login**: Secure login using email and password with a token-based authentication system.
   - **Forgot Password**: Users can initiate a password reset process via email.
   - **Email Verification**: New users receive a verification email containing an OTP for account activation.

### 2. **Homepage**
   - **Course Highlights**: Displays featured and popular courses with thumbnails and descriptions.
   - **Category Section**: Showcases various categories of courses, allowing users to filter courses by interests.
   - **Search Bar**: A search feature to quickly find courses by title or keyword.

### 3. **Course List Page**
   - **Course Cards**: Each course is presented as a card with essential details like title, instructor, rating, and price.
   - **Filters**: Users can filter courses based on categories, ratings, price ranges, and course levels.
   - **Sorting**: Options to sort courses by newest, most popular, or highest-rated.

### 4. **Course Details Page**
   - **Course Overview**: Detailed information about the course, including descriptions, syllabus, prerequisites, and instructor information.
   - **Enroll Button**: Students can enroll in the course directly from this page.
   - **Rating and Review Section**: Users can read reviews and submit their own ratings and feedback for the course.

### 5. **User Dashboard**
   - **Profile Management**: Users can update personal information, change passwords, and manage profile pictures.
   - **Enrolled Courses**: A list of courses the user is currently enrolled in, with progress tracking and quick access to course materials.
   - **Settings**: Users can adjust their account settings, including email preferences and notification settings.

### 6. **Instructor Dashboard**
   - **Course Management**: Instructors can create, edit, or delete their courses and manage course content.
   - **Analytics**: View performance metrics, including student enrollments, course ratings, and earnings from courses.
   - **Student Interaction**: Communicate with enrolled students via announcements or messages.

### 7. **Admin Dashboard**
   - **User Management**: Admins can view, edit, or delete user accounts and manage user roles (Admin, Student, Instructor).
   - **Course Oversight**: Admins can review, approve, or reject new courses created by instructors.
   - **Reporting Tools**: Access to various reports on user activity, course performance, and system usage.

### 8. **Responsive Design**
   - **Mobile-Friendly**: The frontend is optimized for both desktop and mobile devices, ensuring a great user experience across different screen sizes.
   - **Interactive Elements**: Smooth transitions and animations using GSAP and Tailwind CSS for a modern look and feel.

---

## Backend Features

The backend of StudyNotion is built with Node.js and Express.js, providing a robust API for managing users, courses, and other functionalities. Key features include:

### 1. **User Management**
   - **User Registration**: Handles user signup, including email validation and OTP generation.
   - **User Login**: Implements secure authentication with JWT for session management.
   - **Profile Management**: APIs to retrieve, update, and delete user profiles, including personal information and course history.
   - **Role-Based Access Control**: Distinguishes between Admin, Instructor, and Student roles, allowing different levels of access and functionality.

### 2. **Course Management**
   - **Course Creation**: Instructors can create new courses with details, including title, description, syllabus, and multimedia content.
   - **CRUD Operations**: APIs for creating, reading, updating, and deleting courses and their associated sections and subsections.
   - **Enrollment Tracking**: Keeps track of enrolled students and their progress through the course material.

### 3. **Ratings and Reviews**
   - **Rating System**: Allows users to submit ratings and reviews for courses, contributing to overall course feedback.
   - **Review Moderation**: Admins can manage and moderate reviews to ensure quality and relevance.

### 4. **Category Management**
   - **Category Creation**: Admins can create and manage categories for organizing courses.
   - **Course Categorization**: Each course can be associated with one or more categories for better discoverability.

### 5. **Contact Us Feature**
   - **Contact Form Handling**: Receives user inquiries and feedback, storing them for admin review.

### 6. **Payment Integration**
   - **Payment Processing**: Integrates with Razorpay for handling course purchases, including secure payment processing and transaction management.

### 7. **Email Notifications**
   - **Nodemailer Integration**: Sends email notifications for various actions, including account verification, password resets, and course enrollment confirmations.

### 8. **Security Features**
   - **JWT Authentication**: Uses JSON Web Tokens for secure API access and session management.
   - **Password Hashing**: Employs bcrypt for securely hashing user passwords before storing them in the database.
   - **Rate Limiting**: Implements rate limiting to prevent abuse of the API endpoints.

### 9. **Database Management**
   - **MongoDB Integration**: Uses MongoDB for flexible and scalable data storage, with Mongoose for schema management.
   - **Data Validation**: Ensures data integrity through schema validation in Mongoose.

### 10. **Logging and Monitoring**
   - **Activity Logging**: Logs significant actions for auditing and debugging purposes.
   - **Error Handling**: Centralized error handling to manage API errors gracefully and provide meaningful feedback to users.

---

## Deployment

StudyNotion is deployed with the following configurations:

- **Frontend**: Hosted on Vercel.
- **Backend**: Hosted on Render or Railway.
- **Media Storage**: Managed with Cloudinary.
- **Database**: Hosted on MongoDB Atlas.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.
