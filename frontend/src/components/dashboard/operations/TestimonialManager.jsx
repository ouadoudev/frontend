import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import TestimonialPopup from "../TestimonialPopup"
import { useTimeTracker } from "@/hooks/useTimeTracker"

const TestimonialManager = ({ children }) => {
  const { user } = useSelector((state) => state.auth)
  const { hasGivenTestimonial, totalTimeSpent } = useSelector((state) => state.testimonials.eligibility || {})
  const [showPopup, setShowPopup] = useState(false)
  const [hasShownPopup, setHasShownPopup] = useState(false)
  const timeSpent = useTimeTracker()

  // Minimum time required to show testimonial popup (5 minutes in seconds)
  const MIN_TIME_REQUIRED = 1800

  useEffect(() => {
    // Only proceed if we have a valid non-admin user
    if (!user || user.role === "admin") return

    // Check if conditions are met to show the popup
    const shouldShowPopup = (
      !hasGivenTestimonial && 
      (timeSpent >= MIN_TIME_REQUIRED || totalTimeSpent >= MIN_TIME_REQUIRED) &&
      !hasShownPopup &&
      !showPopup
    )

    if (shouldShowPopup) {
      setShowPopup(true)
      setHasShownPopup(true)
    }
  }, [user, timeSpent, totalTimeSpent, hasGivenTestimonial, hasShownPopup, showPopup])

  return (
    <>
      {children}
      {user && user.role !== "admin" && (
        <TestimonialPopup 
          open={showPopup} 
          onClose={() => setShowPopup(false)} 
          timeSpent={Math.max(timeSpent, totalTimeSpent || 0)} 
        />
      )}
    </>
  )
}

export default TestimonialManager