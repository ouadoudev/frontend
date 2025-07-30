/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  deleteReview,
  fetchReviews,
  updateReview,
} from "@/store/reviewSlice";
import { loggedUser } from "@/store/authSlice";
import { SendIcon, StarIcon } from "lucide-react";
import { Button } from "./ui/button";
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
} from "./ui/alert-dialog";

const ReviewForm = ({ courseId }) => {
  const user = useSelector(loggedUser);
  const reviews = useSelector((state) => state.reviews.reviews);
  const dispatch = useDispatch();
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchReviews(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    const existingReview = reviews.find(
      (review) => review.user._id === user.id
    );
    if (existingReview) {
      setUserReview(existingReview);
      setNewReview({
        comment: existingReview.comment,
        rating: existingReview.rating,
      });
    }
  }, [reviews, user.id]);

  const handleRatingChange = (e) => {
    setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) });
  };

  const handleCommentChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (userReview) {
        await dispatch(
          updateReview({
            courseId,
            reviewId: userReview._id,
            reviewData: newReview,
          })
        );
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
          })
        );
      }
      setNewReview({ comment: "", rating: 0 });
      setIsEditing(false);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Handle the "Edit Review" button click
  const handleEditClick = () => {
    setIsEditing(true); // Open the edit modal
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsEditing(false); // Close the modal without saving
    if (userReview) {
      setNewReview({ comment: userReview.comment, rating: userReview.rating });
    }
  };
const handleDelete = async (courseId, reviewId) => {
  await dispatch(deleteReview({ courseId, reviewId }));
  setIsEditing(false); // Close modal
  setUserReview(null); // Reset user review
  setNewReview({ comment: "", rating: 0 }); // Reset form
};

  // Render the user's review if they have already submitted one
  if (userReview) {
    return (
      <>
        <Button onClick={handleEditClick} className="mt-2">
          Edit Review
        </Button>
        {/* Edit Review Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-96">
              <h3 className="text-xl font-bold mb-4">Edit your Review</h3>
              <div className="flex items-center mb-4">
                <span className="text-gray-600 font-extrabold mr-3">
                  Rate this course:
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <label
                      key={index}
                      htmlFor={`star${index + 1}`}
                      className="cursor-pointer"
                    >
                      <StarIcon
                        className={`h-6 w-6 fill-current ${
                          index + 1 <= newReview.rating
                            ? "text-yellow-500"
                            : "text-gray-400"
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
                placeholder="Write your review..."
                className="w-full p-2 mb-4 border border-gray-300 rounded-md resize-none"
              />
              <div className="flex justify-end">
                <Button onClick={handleModalClose} className="mr-2">
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview}>Save Changes</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the review. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(courseId, userReview._id)}
                      >
                        Delete Review
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <form
      onSubmit={handleSubmitReview}
      className="relative p-4 border border-gray-300 rounded-md bg-white shadow-sm mt-2"
    >
      <div className="flex items-center mb-4">
        <span className="text-gray-600 font-extrabold mr-3">
          Rate this course:
        </span>
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <label
              key={index}
              htmlFor={`star${index + 1}`}
              className="cursor-pointer"
            >
              <StarIcon
                className={`h-6 w-6 fill-current ${
                  index + 1 <= newReview.rating
                    ? "text-yellow-500"
                    : "text-gray-400"
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
        placeholder="Write your review..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md resize-none"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute w-8 h-8 top-3 right-3 flex items-center justify-center bg-transparent text-black hover:bg-transparent hover:text-gray-700"
      >
        <SendIcon className="w-5 h-5" />
        <span className="sr-only">Send</span>
      </Button>
    </form>
  );
};

export default ReviewForm;
