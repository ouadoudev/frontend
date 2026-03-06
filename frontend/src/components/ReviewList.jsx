import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchReviews } from "@/store/reviewSlice"
import { StarIcon, MessageSquareOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const ReviewList = ({ courseId, courseTitle }) => {
  const dispatch = useDispatch()
  const reviews = useSelector((state) => state.reviews.reviews)
  const reviewStatus = useSelector((state) => state.reviews.status)
  const error = useSelector((state) => state.reviews.error)

  const isRTL = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(courseTitle)

  useEffect(() => {
    if (reviewStatus === "idle") {
      dispatch(fetchReviews(courseId))
    }
  }, [reviewStatus, dispatch, courseId])

  // Composant interne pour afficher les étoiles
  const RatingStars = ({ rating }) => (
    <div className={`flex items-center gap-0.5 ${isRTL ? "flex-row-reverse" : ""}`}>
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-100"
          }`}
        />
      ))}
      <span className={`text-xs font-bold text-gray-500 ${isRTL ? "mr-2" : "ml-2"}`}>
        {rating}/5
      </span>
    </div>
  )

  // Rendu du chargement (Skeleton)
  if (reviewStatus === "loading") {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`flex gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (reviewStatus === "failed") {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
        {isRTL ? "حدث خطأ أثناء تحميل المراجعات." : "Erreur lors du chargement des avis."}
      </div>
    )
  }

  return (
    <section className="mt-6" dir={isRTL ? "rtl" : "ltr"}>
      <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        {isRTL ? "مراجعات الطلاب" : "Avis des étudiants"}
        <span className="text-sm font-normal text-gray-500">({reviews.length})</span>
      </h2>

      <div className="flex flex-col gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div 
              key={review._id} 
              className={`flex gap-4 p-4 rounded-2xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all ${
                isRTL ? "flex-row" : "flex-row"
              }`}
            >
              <Avatar className="h-10 w-10 border shadow-sm">
                <AvatarImage 
                  src={review.user?.user_image?.url || "/placeholder.svg"} 
                  alt={review.user?.username} 
                />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {review.user?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {review.user?.username}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                    {new Date(review.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <RatingStars rating={review.rating} />

                <p className="text-gray-600 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-3xl">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <MessageSquareOff className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm text-center">
              {isRTL 
                ? "لا توجد مراجعات لهذا الكورس بعد. كن أول من يشارك رأيه!" 
                : "Aucun avis pour le moment. Soyez le premier à partager votre expérience !"}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReviewList