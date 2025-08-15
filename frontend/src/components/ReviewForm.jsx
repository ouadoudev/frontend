// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createReview,
//   deleteReview,
//   fetchReviews,
//   updateReview,
// } from "@/store/reviewSlice";
// import { loggedUser } from "@/store/authSlice";
// import { SendIcon, StarIcon } from "lucide-react";
// import { Button } from "./ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "./ui/alert-dialog";

// const ReviewForm = ({ courseId }) => {
//   const user = useSelector(loggedUser);
//   const reviews = useSelector((state) => state.reviews.reviews);
//   const dispatch = useDispatch();
//   const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
//   const [userReview, setUserReview] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     dispatch(fetchReviews(courseId));
//   }, [dispatch, courseId]);

//   useEffect(() => {
//     const existingReview = reviews.find(
//       (review) => review.user._id === user.id
//     );
//     if (existingReview) {
//       setUserReview(existingReview);
//       setNewReview({
//         comment: existingReview.comment,
//         rating: existingReview.rating,
//       });
//     }
//   }, [reviews, user.id]);

//   const handleRatingChange = (e) => {
//     setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) });
//   };

//   const handleCommentChange = (e) => {
//     setNewReview({ ...newReview, comment: e.target.value });
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
//     try {
//       if (userReview) {
//         await dispatch(
//           updateReview({
//             courseId,
//             reviewId: userReview._id,
//             reviewData: newReview,
//           })
//         );
//       } else {
//         // Create a new review
//         await dispatch(
//           createReview({
//             courseId,
//             reviewData: {
//               user: user.id,
//               rating: newReview.rating,
//               comment: newReview.comment,
//             },
//           })
//         );
//       }
//       setNewReview({ comment: "", rating: 0 });
//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   // Handle the "Edit Review" button click
//   const handleEditClick = () => {
//     setIsEditing(true); // Open the edit modal
//   };

//   // Handle modal close
//   const handleModalClose = () => {
//     setIsEditing(false); // Close the modal without saving
//     if (userReview) {
//       setNewReview({ comment: userReview.comment, rating: userReview.rating });
//     }
//   };
// const handleDelete = async (courseId, reviewId) => {
//   await dispatch(deleteReview({ courseId, reviewId }));
//   setIsEditing(false); // Close modal
//   setUserReview(null); // Reset user review
//   setNewReview({ comment: "", rating: 0 }); // Reset form
// };

//   // Render the user's review if they have already submitted one
//   if (userReview) {
//     return (
//       <>
//         <Button onClick={handleEditClick} className="mt-2">
//           Edit Review
//         </Button>
//         {/* Edit Review Modal */}
//         {isEditing && (
//           <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-md shadow-lg w-96">
//               <h3 className="text-xl font-bold mb-4">Edit your Review</h3>
//               <div className="flex items-center mb-4">
//                 <span className="text-gray-600 font-extrabold mr-3">
//                   Rate this course:
//                 </span>
//                 <div className="flex">
//                   {[...Array(5)].map((_, index) => (
//                     <label
//                       key={index}
//                       htmlFor={`star${index + 1}`}
//                       className="cursor-pointer"
//                     >
//                       <StarIcon
//                         className={`h-6 w-6 fill-current ${
//                           index + 1 <= newReview.rating
//                             ? "text-yellow-500"
//                             : "text-gray-400"
//                         }`}
//                       />
//                       <input
//                         className="sr-only"
//                         type="radio"
//                         id={`star${index + 1}`}
//                         name="rate"
//                         value={index + 1}
//                         onChange={handleRatingChange}
//                       />
//                     </label>
//                   ))}
//                 </div>
//               </div>
//               <textarea
//                 value={newReview.comment}
//                 onChange={handleCommentChange}
//                 placeholder="Write your review..."
//                 className="w-full p-2 mb-4 border border-gray-300 rounded-md resize-none"
//               />
//               <div className="flex justify-end">
//                 <Button onClick={handleModalClose} className="mr-2">
//                   Cancel
//                 </Button>
//                 <Button onClick={handleSubmitReview}>Save Changes</Button>
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant="destructive">Delete</Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>
//                         Are you absolutely sure?
//                       </AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This will permanently delete the review. This action
//                         cannot be undone.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel>Cancel</AlertDialogCancel>
//                       <AlertDialogAction
//                         onClick={() => handleDelete(courseId, userReview._id)}
//                       >
//                         Delete Review
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     );
//   }

//   return (
//    <form
//   onSubmit={handleSubmitReview}
//   className="relative p-2 sm:p-4 border border-gray-300 rounded-lg bg-white shadow-sm mt-2 sm:mt-4"
// >
//   <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-3">
//     <span className="text-gray-600 font-semibold text-sm sm:text-base">
//       Rate this course:
//     </span>
//     <div className="flex">
//       {[...Array(5)].map((_, index) => (
//         <label
//           key={index}
//           htmlFor={`star${index + 1}`}
//           className="cursor-pointer touch-manipulation"
//         >
//           <StarIcon
//             className={`h-5 w-5 sm:h-6 sm:w-6 fill-current transition-colors ${
//               index + 1 <= newReview.rating
//                 ? "text-yellow-500"
//                 : "text-gray-400"
//             }`}
//           />
//           <input
//             className="sr-only"
//             type="radio"
//             id={`star${index + 1}`}
//             name="rate"
//             value={index + 1}
//             onChange={handleRatingChange}
//             aria-label={`Rate ${index + 1} star${index + 1 !== 1 ? 's' : ''}`}
//           />
//         </label>
//       ))}
//     </div>
//   </div>
//   <textarea
//     value={newReview.comment}
//     onChange={handleCommentChange}
//     placeholder="Write your review..."
//     className="w-full p-2 sm:p-3 mb-3 sm:mb-4 border border-gray-300 rounded-md resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//     rows={4}
//   />
//   <Button
//     type="submit"
//     size="icon"
//     className="absolute w-8 h-8 sm:w-9 sm:h-9 top-2 sm:top-3 right-2 sm:right-3 flex items-center justify-center bg-transparent text-black hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
//     aria-label="Submit review"
//   >
//     <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//     <span className="sr-only">Submit review</span>
//   </Button>
// </form>
//   );
// };

// export default ReviewForm;

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createReview, deleteReview, fetchReviews, updateReview } from "@/store/reviewSlice"
import { loggedUser } from "@/store/authSlice"
import { SendIcon, StarIcon } from "lucide-react"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"

const ReviewForm = ({ courseId, courseTitle }) => {
  const user = useSelector(loggedUser)
  const reviews = useSelector((state) => state.reviews.reviews)
  const dispatch = useDispatch()
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 })
  const [userReview, setUserReview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
    return rtlChars.test(text) ? "rtl" : "ltr"
  }

  const isRTL = getDirection(courseTitle) === "rtl"

  useEffect(() => {
    dispatch(fetchReviews(courseId))
  }, [dispatch, courseId])

  useEffect(() => {
    const existingReview = reviews.find((review) => review.user._id === user.id)
    if (existingReview) {
      setUserReview(existingReview)
      setNewReview({
        comment: existingReview.comment,
        rating: existingReview.rating,
      })
    }
  }, [reviews, user.id])

  const handleRatingChange = (e) => {
    setNewReview({ ...newReview, rating: Number.parseInt(e.target.value, 10) })
  }

  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value })
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    try {
      if (userReview) {
        await dispatch(
          updateReview({
            courseId,
            reviewId: userReview._id,
            reviewData: newReview,
          }),
        )
      } else {
        // Create a new review
        await dispatch(
          createReview({
            courseId,
            reviewData: {
              user: user.id,
              rating: newReview.rating,
              comment: newReview.comment,
            },
          }),
        )
      }
      setNewReview({ comment: "", rating: 0 })
      setIsEditing(false)
    } catch (error) {
      console.error("Error submitting review:", error)
    }
  }

  // Handle the "Edit Review" button click
  const handleEditClick = () => {
    setIsEditing(true) // Open the edit modal
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsEditing(false) // Close the modal without saving
    if (userReview) {
      setNewReview({ comment: userReview.comment, rating: userReview.rating })
    }
  }

  const handleDelete = async (courseId, reviewId) => {
    await dispatch(deleteReview({ courseId, reviewId }))
    setIsEditing(false) // Close modal
    setUserReview(null) // Reset user review
    setNewReview({ comment: "", rating: 0 }) // Reset form
  }

  // Render the user's review if they have already submitted one
  if (userReview) {
    return (
      <>
        <Button onClick={handleEditClick} className="mt-2">
          {isRTL ? "تعديل المراجعة" : "Edit Review"}
        </Button>
        {/* Edit Review Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96" dir={isRTL ? "rtl" : "ltr"}>
              <h3 className="text-xl font-bold mb-4">{isRTL ? "تعديل مراجعتك" : "Edit your Review"}</h3>
              <div className={`flex items-center mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className={`text-gray-600 font-extrabold ${isRTL ? "ml-3" : "mr-3"}`}>
                  {isRTL ? "قيم هذا الكورس:" : "Rate this course:"}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <label key={index} htmlFor={`star${index + 1}`} className="cursor-pointer">
                      <StarIcon
                        className={`h-6 w-6 fill-current ${
                          index + 1 <= newReview.rating ? "text-yellow-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        className="sr-only"
                        type="radio"
                        id={`star${index + 1}`}
                        name="rate"
                        value={index + 1}
                        onChange={handleRatingChange}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.comment}
                onChange={handleCommentChange}
                placeholder={isRTL ? "اكتب مراجعتك..." : "Write your review..."}
                className="w-full p-2 mb-4 border border-gray-300 rounded-md resize-none"
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div className={`flex ${isRTL ? "justify-start" : "justify-end"}`}>
                <Button onClick={handleModalClose} className={`${isRTL ? "ml-2" : "mr-2"}`}>
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button onClick={handleSubmitReview}>{isRTL ? "حفظ التغييرات" : "Save Changes"}</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className={`${isRTL ? "mr-2" : "ml-2"}`}>
                      {isRTL ? "حذف" : "Delete"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{isRTL ? "هل أنت متأكد تمامًا؟" : "Are you absolutely sure?"}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {isRTL
                          ? "سيؤدي هذا إلى حذف المراجعة نهائيًا. لا يمكن التراجع عن هذا الإجراء."
                          : "This will permanently delete the review. This action cannot be undone."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className={`${isRTL ? "flex-row-reverse" : ""}`}>
                      <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(courseId, userReview._id)}>
                        {isRTL ? "حذف المراجعة" : "Delete Review"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
  return (
    <form
      onSubmit={handleSubmitReview}
      className="relative p-2 sm:p-4 border border-gray-300 rounded-lg bg-white shadow-sm mt-2 sm:mt-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <span className={`text-gray-600 font-semibold text-sm sm:text-base ${isRTL ? "ml-auto" : "mr-auto"}`}>
          {isRTL ? "قيم هذا الكورس:" : "Rate this course:"}
        </span>
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <label key={index} htmlFor={`star${index + 1}`} className="cursor-pointer touch-manipulation">
              <StarIcon
                className={`h-5 w-5 sm:h-6 sm:w-6 fill-current transition-colors ${
                  index + 1 <= newReview.rating ? "text-yellow-500" : "text-gray-400"
                }`}
              />
              <input
                className="sr-only"
                type="radio"
                id={`star${index + 1}`}
                name="rate"
                value={index + 1}
                onChange={handleRatingChange}
                aria-label={`Rate ${index + 1} star${index + 1 !== 1 ? "s" : ""}`}
              />
            </label>
          ))}
        </div>
      </div>
      <div className="relative">
        {" "}
        {/* New relative container for textarea and button */}
        <textarea
          value={newReview.comment}
          onChange={handleCommentChange}
          placeholder={isRTL ? "اكتب مراجعتك..." : "Write your review..."}
          className={`w-full p-2 sm:p-3 mb-3 sm:mb-4 border border-gray-300 rounded-md resize-none text-sm sm:text-base min-h-[80px] sm:min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isRTL ? "pr-10 sm:pr-12" : "pl-10 sm:pl-12"
          }`} /* Added padding */
          rows={4}
          dir={isRTL ? "rtl" : "ltr"}
        />
        <Button
          type="submit"
          size="icon"
          className={`absolute w-8 h-8 sm:w-9 sm:h-9 top-2 sm:top-3 flex items-center justify-center bg-transparent text-black hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors ${
            isRTL ? "left-2 sm:left-3" : "right-2 sm:right-3"
          }`} /* Positioned relative to the new container */
          aria-label="Submit review"
        >
          <SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="sr-only">Submit review</span>
        </Button>
      </div>
    </form>
  )
}
export default ReviewForm
