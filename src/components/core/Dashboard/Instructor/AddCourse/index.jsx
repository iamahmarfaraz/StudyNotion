import RenderSteps from "./RenderSteps";

export default function AddCourse() {
  return (
    <>
      <div className="flex flex-col xl:flex-row w-full items-start gap-x-6">
        {/* Left Part */}
        <div className="flex-1 flex flex-col w-full">
          <h1 className="mb-6 xl:mb-14 text-2xl xl:text-3xl font-medium text-richblack-5">
            Add a Course
          </h1>
          <div className="flex-1 w-full">
            {/* Form */}
            <RenderSteps />
          </div>
        </div>

        {/* Instruction part */}
        <div className="sticky top-10 hidden xl:block max-w-[400px] flex-1 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
          <p className="mb-8 text-lg text-richblue-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-4 text-xs text-richblack-5">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
            <li>Information from the Additional Data section shows up on the course single page.</li>
            <li>Make Announcements to notify any important updates to all enrolled students.</li>
          </ul>
        </div>

        {/* Responsive Tips for Mobile */}
        <div className="block xl:hidden w-full rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 mt-6">
          <p className="mb-4 text-lg text-richblue-5">⚡ Course Upload Tips</p>
          <ul className="ml-5 list-item list-disc space-y-2 text-xs text-richblack-5">
            <li>Set the Course Price option or make it free.</li>
            <li>Standard size for the course thumbnail is 1024x576.</li>
            <li>Video section controls the course overview video.</li>
            <li>Course Builder is where you create & organize a course.</li>
            <li>Add Topics to create lessons, quizzes, and assignments.</li>
            <li>Additional Data section information shows up on the course page.</li>
            <li>Make Announcements to notify enrolled students.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
