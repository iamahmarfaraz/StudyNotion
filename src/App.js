import "./App.css";
import { Route,Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LogEntry from "./pages/LogEntry";
import SignIntoEdtech from "./pages/SignIntoEdtech";
import Nav from "./components/common/Nav";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from './slices/authSlice';
import { setUser } from './slices/profileSlice';
import { setCart } from "./slices/cartSlice";
import { setWishlist } from "./slices/wishlistSlice";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfle";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/Student/EnrolledCourses";
import { ACCOUNT_TYPE } from "./utils/constants";
import Cart from "./components/core/Dashboard/Student/Cart";
import MyCourses from "./components/core/Dashboard/Instructor/MyCourse/MyCourses";
import AddCourse from "./components/core/Dashboard/Instructor/AddCourse";
import EditCourse from "./components/core/Dashboard/Instructor/EditCourse";
import Instructor from "./components/core/Dashboard/Instructor/Dashboard/Instructor";
import BookmarkedCourses from "./components/core/Dashboard/Student/Wishlist";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import AddCategory from "./components/core/Dashboard/Admin/AddCategory";
import AllCourses from "./components/core/Dashboard/Admin/AllCourses";
import AllUsers from "./components/core/Dashboard/Admin/AllUsers";
import Searchpage from "./pages/Searchpage";


function App() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile)
  // const { cart, total, totalItems } = useSelector((state) => state.cart);
  // const {wishlist,totalWishlist,totalWishlistItems} = useSelector((state)=>state.wishlist)

  useEffect(() => {
    try {
      // Retrieve data from localStorage safely
      const token = JSON.parse(localStorage.getItem("token")) || null;
      const user = JSON.parse(localStorage.getItem("user")) || null;
  
      // Safely retrieve cart, total, and totalItems, fallback to defaults if not found
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const total = JSON.parse(localStorage.getItem("total")) ?? 0;
      const totalItems = JSON.parse(localStorage.getItem("totalItems")) ?? 0;
  
      // Safely retrieve wishlist, totalWishlist, and totalWishlistItems, fallback to defaults if not found
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const totalWishlist = JSON.parse(localStorage.getItem("totalWishlist")) ?? 0;
      const totalWishlistItems = JSON.parse(localStorage.getItem("totalWishlistItems")) ?? 0;
  
      // Dispatch token and user to the Redux store if they exist
      if (token) {
        dispatch(setToken(token));
      }
      if (user) {
        dispatch(setUser(user));
      }
  
      // Dispatch cart, total, and totalItems to Redux store if they are valid
      if (cart.length > 0 && total >= 0 && totalItems >= 0) {
        dispatch(setCart({ cart, total, totalItems }));
      }
  
      // Dispatch wishlist, totalWishlist, and totalWishlistItems if they are valid
      if (wishlist.length > 0 && totalWishlist >= 0 && totalWishlistItems >= 0) {
        dispatch(setWishlist({ wishlist, totalWishlist, totalWishlistItems }));
      }
    } catch (error) {
      console.error("Error parsing data from localStorage", error);
    }
  }, [dispatch]);
  
  

  return (
    <div className="w-screen min-h-screen  flex flex-col font-inter">
      <Nav/>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>}></Route>
        
        <Route path="/login" element={
          <OpenRoute>
            <LogEntry></LogEntry>
          </OpenRoute>
          }></Route>

        <Route path="/signup" element={
          <OpenRoute>
            <SignIntoEdtech></SignIntoEdtech>
          </OpenRoute>
          }></Route>
          
        <Route path="/forgot-password" element={
          <OpenRoute>
            <ForgotPassword></ForgotPassword>
          </OpenRoute>
          }></Route>

          <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
          /> 

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        /> 

        <Route
          path="about"
          element={
            <OpenRoute>
              <About />
            </OpenRoute>
          }
        /> 

        <Route
          path="contact"
          element={
            <OpenRoute>
              <ContactUs />
            </OpenRoute>
          }
          /> 
          <Route path="catalog/:catalogName" element={<Catalog />} />
          <Route path="courses/:courseId" element={<CourseDetails />} />
          <Route path="search/:query" element={<Searchpage />} />

          {/* NESTED ROUTES */}
          <Route element={
            <PrivateRoute>
              <Dashboard></Dashboard>
            </PrivateRoute>
          }>
              <Route path="dashboard/my-profile" element={<MyProfile />} />
              <Route path="dashboard/settings" element={<Settings />} />

              {(user?.accountType === ACCOUNT_TYPE.STUDENT ||
                ACCOUNT_TYPE.ADMIN) && (
                <>
                  <Route
                    path="dashboard/enrolled-courses"
                    element={<EnrolledCourses />}
                  />
                  <Route path="dashboard/cart" element={<Cart />} />
                  <Route path="dashboard/bookmarked-courses" element={<BookmarkedCourses/>}/>
                </>
              )}

              {user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
                <>
                  <Route path="dashboard/my-courses" element={<MyCourses />} />
                  <Route path="dashboard/add-course" element={<AddCourse />} />
                  <Route path="dashboard/instructor" element={<Instructor />} />
                  <Route
                    path="dashboard/edit-course/:courseId"
                    element={<EditCourse />}
                  />
                </>
              )}
              {user?.accountType === ACCOUNT_TYPE.ADMIN && (
                <>
                  <Route path="dashboard/add-category" element={<AddCategory />} />
                  <Route path="dashboard/all-courses" element={<AllCourses />} />
                  <Route path="dashboard/all-users" element={<AllUsers />} />
                </>
              )}
          </Route>

           {/* View courses Route */}
            <Route
              element={
                <PrivateRoute>
                  <ViewCourse />
                </PrivateRoute>
              }
            >
              {user?.accountType === ACCOUNT_TYPE.STUDENT && (
                <>
                  <Route
                    path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                    element={<VideoDetails />}
                  />
                </>
              )}
            </Route>

          <Route path="*" element={<Error/>}></Route>

        </Routes>
    </div>
  );
}

export default App;
