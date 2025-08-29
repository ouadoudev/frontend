import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updateUserTime, updateTimeSpent } from "../store/testimonialSlice"
import { loggedUser } from "../store/authSlice"

export const useTimeTracker = () => {
  const dispatch = useDispatch()
  const user = useSelector(loggedUser)
  const [localTimeSpent, setLocalTimeSpent] = useState(0)
  const intervalRef = useRef(null)
  const lastUpdateRef = useRef(0)

 useEffect(() => {
  if (!user?.id || user?.role === "admin") return

    // Démarrer le compteur local
    intervalRef.current = setInterval(() => {
      setLocalTimeSpent((prev) => {
        const newTime = prev + 1
        dispatch(updateTimeSpent(newTime))

        // Envoyer au serveur toutes les 30 secondes
        if (newTime - lastUpdateRef.current >= 30) {
          dispatch(updateUserTime(30))
          lastUpdateRef.current = newTime
        }

        return newTime
      })
    }, 1000)

    // Gérer la visibilité de la page
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page cachée - envoyer le temps accumulé et arrêter le compteur
        if (intervalRef.current) {
          const timeToSend = localTimeSpent - lastUpdateRef.current
          if (timeToSend > 0) {
            dispatch(updateUserTime(timeToSend))
            lastUpdateRef.current = localTimeSpent
          }
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        // Page visible - reprendre le compteur
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            setLocalTimeSpent((prev) => {
              const newTime = prev + 1
              dispatch(updateTimeSpent(newTime))

              if (newTime - lastUpdateRef.current >= 30) {
                dispatch(updateUserTime(30))
                lastUpdateRef.current = newTime
              }

              return newTime
            })
          }, 1000)
        }
      }
    }

    // Envoyer le temps avant de quitter la page
    const handleBeforeUnload = () => {
      const timeToSend = localTimeSpent - lastUpdateRef.current
      if (timeToSend > 0) {
        // Utiliser sendBeacon pour un envoi fiable
        navigator.sendBeacon(
          `${process.env.REACT_APP_API_URL}/testimonials/update-time`,
          JSON.stringify({ timeSpent: timeToSend }),
        )
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Nettoyage
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)

      // Envoyer le temps restant
      const timeToSend = localTimeSpent - lastUpdateRef.current
      if (timeToSend > 0) {
        dispatch(updateUserTime(timeToSend))
      }
    }
  }, [user?.id, user?.role, dispatch, localTimeSpent])

  return localTimeSpent
}
