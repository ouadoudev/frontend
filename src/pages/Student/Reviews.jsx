import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReviewToLesson, fetchLessonReviews } from "../../store/lessonSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { loggedUser } from "@/store/authSlice";


const Reviews = ( lessonId ) => {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.lesson);
  const user = useSelector(loggedUser);
  
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });

  const handleRatingChange = (e) => {
    setNewReview({ ...newReview, rating: parseInt(e.target.value) });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addReviewToLesson({
          lessonId,
          reviewData: {
            user: user._id,
            rating: newReview.rating,
            comment: newReview.comment,
          },
        })
      ).unwrap();
      setNewReview({ comment: "", rating: 0 });
      dispatch(fetchLessonReviews(lessonId)); 
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <Card className="flex flex-col bg-transparent" style={{ maxHeight: "470px", overflowY: "auto" }}>
      <CardHeader>
        <CardTitle>Reviews :</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitReview}>
          <div className="rating flex justify-start items-center mb-4">
            <span className="text-gray-600 mr-2">Rate this lesson:</span>
            {[...Array(5)].map((_, index) => (
              <label key={index} htmlFor={`star${5 - index}`} className="cursor-pointer">
                <StarIcon
                  className={`h-6 w-6 fill-current ${5 - index <= newReview.rating ? "text-yellow-500" : "text-gray-400"}`}
                />
                <input
                  className="sr-only"
                  type="radio"
                  id={`star${5 - index}`}
                  name="rate"
                  value={5 - index}
                  onChange={handleRatingChange}
                />
              </label>
            ))}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Write your review..."
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="w-40 h-8 mb-0 ml-[60%] bg-[#0066E7] rounded-xl text-white hover:bg-blue-600">
            Submit
          </button>
        </form>
      </CardContent>
      <CardContent>
        <div className="flex flex-col">
          {reviews.map((review) => (
            <div key={review._id} className="flex flex-col p-8 rounded-2xl bg-white mb-4 shadow-md">
              <div className="flex items-center gap-4">
                {review.user?.user_image && (
                  <img src={review.user.user_image.url} alt="User" className="rounded-full object-cover w-12 h-12" />
                )}
                <div className="text-gray-600 text-sm">
                  {review.user?.username && <span className="font-semibold">{review.user.username}</span>}
                  <h4 className="text-xs text-gray-500">
                    Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                  </h4>
                </div>
              </div>
              <div className="text-gray-600 text-sm mt-2">
                <p className="text-lg">{review.comment}</p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold">{review.rating}/5</span>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 fill-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-6 w-6 fill-muted stroke-muted-foreground" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Reviews;
