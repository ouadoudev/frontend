
import { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPartenaires } from "@/store/partenaireSlice"
import { Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
const Partenaires = () => {
  const dispatch = useDispatch()
  const { partenaires, status, error } = useSelector((state) => state.partenaires)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [maxIndex, setMaxIndex] = useState(0)

  const scrollContainerRef = useRef(null)
  const autoScrollRef = useRef(null)
  const observerRef = useRef(null)

  const featuredPartners = partenaires

  // Calculate max index based on visible items
  useEffect(() => {
    const updateMaxIndex = () => {
      if (!scrollContainerRef.current || !featuredPartners.length) return

      const container = scrollContainerRef.current
      const containerWidth = container.offsetWidth
      const itemWidth = container.children[0]?.offsetWidth || 0

      if (itemWidth > 0) {
        const visibleItems = Math.floor(containerWidth / itemWidth)
        setMaxIndex(Math.max(0, featuredPartners.length - visibleItems))
      }
    }

    updateMaxIndex()
    window.addEventListener("resize", updateMaxIndex)
    return () => window.removeEventListener("resize", updateMaxIndex)
  }, [featuredPartners.length])

  // Fetch partners
  useEffect(() => {
    dispatch(fetchPartenaires())
  }, [dispatch])

  // Intersection Observer to track current slide
  useEffect(() => {
    if (!scrollContainerRef.current || !featuredPartners.length) return

    const container = scrollContainerRef.current
    const options = {
      root: container,
      rootMargin: "0px",
      threshold: 0.5,
    }

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Array.from(container.children).indexOf(entry.target)
          if (index !== -1) {
            setCurrentIndex(
              Math.floor(index / Math.max(1, Math.floor(container.offsetWidth / entry.target.offsetWidth))),
            )
          }
        }
      })
    }, options)

    Array.from(container.children).forEach((child) => {
      observerRef.current.observe(child)
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [featuredPartners.length])

  // Auto scroll
  useEffect(() => {
    if (isAutoPlaying && !isPaused && featuredPartners.length > 0 && maxIndex > 0) {
      autoScrollRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev >= maxIndex ? 0 : prev + 1
          scrollToIndex(nextIndex)
          return nextIndex
        })
      }, 4000)
    }
    return () => clearInterval(autoScrollRef.current)
  }, [isAutoPlaying, isPaused, maxIndex, featuredPartners.length])

  // Scroll to specific index
  const scrollToIndex = useCallback((index) => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const itemWidth = container.children[0]?.offsetWidth || 0
    const scrollPosition = index * itemWidth

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })
  }, [])

  // Navigation functions
  const goToSlide = useCallback(
    (index) => {
      const newIndex = Math.max(0, Math.min(index, maxIndex))
      setCurrentIndex(newIndex)
      scrollToIndex(newIndex)
    },
    [maxIndex, scrollToIndex],
  )

  const nextSlide = useCallback(() => {
    const newIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1
    goToSlide(newIndex)
  }, [currentIndex, maxIndex, goToSlide])

  const prevSlide = useCallback(() => {
    const newIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1
    goToSlide(newIndex)
  }, [currentIndex, maxIndex, goToSlide])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return

    // Pause auto-play when user manually scrolls
    setIsPaused(true)
    clearTimeout(autoScrollRef.current)

    // Resume auto-play after scroll ends
    setTimeout(() => {
      setIsPaused(false)
    }, 2000)
  }, [])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-600 font-semibold mt-20">Une erreur est survenue : {error}</div>
  }

  if (!featuredPartners.length) {
    return null
  }

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            Partenaires vedettes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Nos{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              partenaires d'excellence
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez les institutions éducatives prestigieuses qui nous font confiance pour former les leaders de
            demain
          </p>
        </div>

        <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>

          {/* Carousel Container with Native Scroll */}
          <div className="overflow-hidden mx-2 sm:mx-6 lg:mx-12">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-2 sm:gap-4 lg:gap-6 pb-2"
              onScroll={handleScroll}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {featuredPartners.map((partner, index) => (
                <div key={partner._id} className="flex-shrink-0 snap-start w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4">
                  <div className="transition-all duration-300 group py-2 sm:py-4 text-center">
                    <img
                      src={partner.logo?.url || "/placeholder.svg?height=60&width=120"}
                      alt={`Logo de ${partner.name}`}
                      className="mx-auto max-h-10 sm:max-h-12 md:max-h-16 xl:max-h-24 object-contain"
                      loading="lazy"
                    />
                    <p className="text-xs sm:text-sm lg:text-base font-serif text-gray-700 mt-1 sm:mt-2 lg:mt-3 px-1">
                      {partner.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

export default Partenaires
