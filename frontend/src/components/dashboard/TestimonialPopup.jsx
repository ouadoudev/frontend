import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createTestimonial, checkEligibility } from "@/store/testimonialSlice"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Star } from "lucide-react"
import { toast } from "react-toastify"

const TestimonialPopup = ({ open, onClose, timeSpent }) => {
  const dispatch = useDispatch()
  const { status, error, eligibility } = useSelector((state) => state.testimonials)
  const { user } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({ 
    rating: 0, 
    testimonial: "" 
  })
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setFormData({ rating: 0, testimonial: "" })
      setHoveredRating(0)
      dispatch(checkEligibility())
    }
  }, [open, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right", autoClose: 3000 })
    }
  }, [error])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.rating) {
      toast.error("Veuillez sélectionner une note", { position: "bottom-right", autoClose: 3000 })
      return
    }

    if (!formData.testimonial.trim()) {
      toast.error("Veuillez écrire votre témoignage", { position: "bottom-right", autoClose: 3000 })
      return
    }

    if (formData.testimonial.trim().length < 10) {
      toast.error("Le témoignage doit contenir au moins 10 caractères", { position: "bottom-right", autoClose: 3000 })
      return
    }

    setIsSubmitting(true)
    try {
      const resultAction = await dispatch(createTestimonial(formData))
      
      if (createTestimonial.fulfilled.match(resultAction)) {
        toast.success("Merci pour votre témoignage précieux !", { position: "bottom-right", autoClose: 3000 })
        await dispatch(checkEligibility())
        onClose()
      }
    } catch (error) {
      toast.error("Erreur lors de l'envoi du témoignage", { position: "bottom-right", autoClose: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!user || eligibility?.hasGivenTestimonial) return null

  return (
    <Dialog open={open && !eligibility?.hasGivenTestimonial} onOpenChange={!isSubmitting ? onClose : undefined}>
      <DialogContent className="w-96 h-82 sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dites-nous tout !</DialogTitle>
          <DialogDescription>
            Votre opinion est essentielle pour nous aider à progresser.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mx-4">
          <div className="space-y-2">
            <Label>Note *</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none focus:ring-2 focus:ring-primary rounded transition-transform hover:scale-110"
                  disabled={isSubmitting}
                  aria-label={`Noter ${star} étoile${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || formData.rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial">Votre témoignage *</Label>
            <Textarea
              id="testimonial"
              placeholder="Dites-nous ce que vous avez pensé de votre expérience (minimum 10 caractères)..."
              value={formData.testimonial}
              onChange={(e) => setFormData((prev) => ({ ...prev, testimonial: e.target.value }))}
              rows={4}
              minLength={10}
              maxLength={1000}
              disabled={isSubmitting}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">
              {formData.testimonial.length}/1000 caractères
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Plus tard
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.rating || formData.testimonial.trim().length < 10}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi en cours...
                </span>
              ) : "Partager mon expérience"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default TestimonialPopup