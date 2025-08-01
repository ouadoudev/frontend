"use client"

import { useState, useEffect } from "react"

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/testimonials")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Filter only approved and visible testimonials
      const approvedTestimonials = (data.testimonials || []).filter(
        (testimonial) => testimonial.isApproved && testimonial.isVisible,
      )

      setTestimonials(approvedTestimonials)
    } catch (err) {
      console.error("Error fetching testimonials:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const refetch = () => {
    fetchTestimonials()
  }

  return {
    testimonials,
    loading,
    error,
    refetch,
  }
}
