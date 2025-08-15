// import { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchReviews } from "@/store/reviewSlice";
// import { StarIcon } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// const ReviewList = (courseId) => {
//   const dispatch = useDispatch();
//   const reviews = useSelector((state) => state.reviews.reviews);
//   const reviewStatus = useSelector((state) => state.reviews.status);
//   const error = useSelector((state) => state.reviews.error);

//   useEffect(() => {
//     if (reviewStatus === "idle") {
//       dispatch(fetchReviews(courseId));
//     }
//   }, [reviewStatus, dispatch, courseId]);

//   let content;

//   if (reviewStatus === "loading") {
//     content = <div>Loading...</div>;
//   } else if (reviewStatus === "succeeded") {
//     content = (
//       <div className="flex flex-col">
//         {reviews.map((review) => (
//           <div key={review._id} className="flex space-x-4">
//              {review.user?.user_image && (
//             <Avatar>
//               <AvatarImage
//                 src={review.user.user_image.url}
//                 alt={review.user?.username}
//               />
//               <AvatarFallback>
//                 {review.user?.username
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//              )}
//             <div className="space-y-1">
//             {review.user?.username && (
//               <h3 className="font-semibold">{review.user.username}</h3>
//             )}
//               <p className="text-xs text-muted-foreground">
//               {new Date(review.createdAt).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
//               </p>
//               <p>{review.comment}</p>
//               <div className="flex items-center">
//                 {Array.from({ length: review.rating }).map((_, i) => (
//                   <StarIcon
//                     key={i}
//                     className="h-3 w-3 fill-current text-yellow-400"
//                   />
//                 ))}
//                   {Array.from({ length: 5 - review.rating }).map(
//                     (_, i) => (
//                       <StarIcon
//                         key={i}
//                         className="h-3 w-3 stroke-muted-foreground"
//                       />
//                     )
//                   )}
                 
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   } else if (reviewStatus === "failed") {
//     content = <div>{error}</div>;
//   }

//   return <section>{content}</section>;
// };

// export default ReviewList;

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchReviews } from "@/store/reviewSlice"
import { StarIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const ReviewList = ({ courseId, courseTitle }) => {
  const dispatch = useDispatch()
  const reviews = useSelector((state) => state.reviews.reviews)
  const reviewStatus = useSelector((state) => state.reviews.status)
  const error = useSelector((state) => state.reviews.error)

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
    return rtlChars.test(text) ? "rtl" : "ltr"
  }

  const isRTL = getDirection(courseTitle) === "rtl"

  useEffect(() => {
    // Only fetch if status is 'idle' to prevent multiple fetches on re-renders
    if (reviewStatus === "idle") {
      dispatch(fetchReviews(courseId))
    }
  }, [reviewStatus, dispatch, courseId])

  let content
  if (reviewStatus === "loading") {
    content = <div>{isRTL ? "جاري التحميل..." : "Loading..."}</div>
  } else if (reviewStatus === "succeeded") {
    content = (
      <div className="flex flex-col space-y-4" dir={isRTL ? "rtl" : "ltr"}>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className={`flex ${isRTL ? "flex-row-reverse space-x-reverse" : "space-x-4"}`}>
              {review.user?.user_image && (
                <Avatar>
                  <AvatarImage src={review.user.user_image.url || "/placeholder.svg"} alt={review.user?.username} />
                  <AvatarFallback>
                    {review.user?.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`space-y-1 flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                {review.user?.username && (
                  <h3 className="font-semibold" dir={isRTL ? "rtl" : "ltr"}>
                    {review.user.username}
                  </h3>
                )}
                <p className="text-xs text-muted-foreground" dir={isRTL ? "rtl" : "ltr"}>
                  {new Date(review.createdAt).toLocaleDateString(isRTL ? "ar-SA" : "fr-FR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p dir={isRTL ? "rtl" : "ltr"}>{review.comment}</p>
                <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-3 w-3 fill-current text-yellow-400" />
                  ))}
                  {Array.from({ length: 5 - review.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-3 w-3 stroke-muted-foreground" />
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-3 sm:py-4 text-sm">
            {isRTL ? "لا توجد مراجعات لهذا الكورس بعد." : "No reviews available for this course yet."}
          </p>
        )}
      </div>
    )
  } else if (reviewStatus === "failed") {
    content = <div>Error: {error}</div>
  }
  return <section>{content}</section>
}
export default ReviewList
