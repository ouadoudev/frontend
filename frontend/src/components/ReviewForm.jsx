import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createReview, deleteReview, fetchReviews, updateReview } from "@/store/reviewSlice"
import { loggedUser } from "@/store/authSlice"
import { SendIcon, StarIcon, Loader2, Trash2, Edit3, MessageSquare } from "lucide-react"
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"

const ReviewForm = ({ courseId, courseTitle }) => {
  const user = useSelector(loggedUser)
  const reviews = useSelector((state) => state.reviews.reviews)
  const dispatch = useDispatch()
  
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 })
  const [userReview, setUserReview] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Détection automatique de la direction (RTL/LTR)
  const isRTL = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(courseTitle)

  useEffect(() => {
    dispatch(fetchReviews(courseId))
  }, [dispatch, courseId])

  useEffect(() => {
    const existingReview = reviews.find((review) => review.user._id === user.id)
    if (existingReview) {
      setUserReview(existingReview)
      setNewReview({ comment: existingReview.comment, rating: existingReview.rating })
    }
  }, [reviews, user.id])

  const handleSubmitReview = async (e) => {
    if (e) e.preventDefault()
    if (newReview.rating === 0) return 
    
    setIsSubmitting(true)
    try {
      if (userReview) {
        await dispatch(updateReview({ courseId, reviewId: userReview._id, reviewData: newReview }))
      } else {
        await dispatch(createReview({
          courseId,
          reviewData: { user: user.id, ...newReview }
        }))
      }
      setIsEditing(false)
    } catch (error) {
      console.error("Erreur lors de la soumission :", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    await dispatch(deleteReview({ courseId, reviewId: userReview._id }))
    setIsEditing(false)
    setUserReview(null)
    setNewReview({ comment: "", rating: 0 })
    setIsSubmitting(false)
  }

  // Sous-composant pour les étoiles
  const StarRating = ({ rating, interactive = false }) => (
    <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setNewReview({ ...newReview, rating: star })}
          className={`${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default outline-none"}`}
        >
          <StarIcon
            className={`h-5 w-5 sm:h-6 sm:w-6 transition-colors ${
              star <= rating ? "fill-yellow-500 text-yellow-500" : "fill-transparent text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  )

  // MODE AFFICHAGE : L'utilisateur a déjà laissé un avis
  if (userReview && !isEditing) {
    return (
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mt-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {isRTL ? "تقييمك المنشور" : "Votre avis publié"}
            </p>
            <StarRating rating={userReview.rating} />
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-full bg-white hover:bg-blue-100 transition-colors">
            <Edit3 className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {isRTL ? "تعديل" : "Modifier"}
          </Button>
        </div>
        <p className="text-gray-700 text-sm sm:text-base italic leading-relaxed border-l-2 border-blue-200 pl-4 py-1">
          "{userReview.comment}"
        </p>
      </div>
    )
  }

  return (
    <>
      {/* MODE FORMULAIRE : Premier avis */}
      {!userReview && (
        <form
          onSubmit={handleSubmitReview}
          className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm mt-6"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
              <span className="font-bold text-gray-800">
                {isRTL ? "شاركنا رأيك حول الكورس" : "Donnez votre avis sur ce cours"}
              </span>
            </div>
            <StarRating rating={newReview.rating} interactive />
          </div>
          
          <div className="relative">
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder={isRTL ? "اكتب مراجعتك هنا..." : "Qu'avez-vous pensé de ce cours ?"}
              className="w-full p-4 pb-16 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base min-h-[120px]"
            />
            <div className={`absolute bottom-3 ${isRTL ? "left-3" : "right-3"}`}>
              <Button 
                type="submit" 
                disabled={newReview.rating === 0 || isSubmitting}
                className="rounded-full px-6 shadow-sm"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><SendIcon className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} /> {isRTL ? "إرسال" : "Publier"}</>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* MODALE D'ÉDITION (Dialog) */}
      <Dialog open={isEditing} onOpenChange={(open) => !open && setIsEditing(false)}>
        <DialogContent className="sm:max-w-[450px]" dir={isRTL ? "rtl" : "ltr"}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {isRTL ? "تعديل مراجعتك" : "Modifier votre avis"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-6 space-y-6 text-right rtl:text-right ltr:text-left">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 block">
                {isRTL ? "تقييمك الجديد:" : "Votre nouvelle note :"}
              </label>
              <StarRating rating={newReview.rating} interactive />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-600 block">
                {isRTL ? "تعليقك:" : "Votre commentaire :"}
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-4 border border-gray-200 rounded-xl min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center justify-between w-full gap-4">
              {/* Suppression avec confirmation */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full">
                    <Trash2 className="h-4 w-4 mr-1 ml-1" />
                    {isRTL ? "حذف" : "Supprimer"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{isRTL ? "هل أنت متأكد؟" : "Êtes-vous sûr ?"}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {isRTL ? "سيتم حذف تقييمك نهائياً ولا يمكن التراجع عن ذلك." : "Cette action supprimera définitivement votre avis."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{isRTL ? "Annuler" : "Annuler"}</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
                      {isRTL ? "حذف" : "Supprimer l'avis"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                   {isRTL ? "إلغاء" : "Fermer"}
                </Button>
                <Button onClick={handleSubmitReview} disabled={isSubmitting || newReview.rating === 0}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isRTL ? "حفظ" : "Sauvegarder"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ReviewForm