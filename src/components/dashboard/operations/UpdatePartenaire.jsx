import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import {
  updatePartenaire,
  fetchPartenaireById,
} from "@/store/partenaireSlice"
import { loggedUser } from "../../../store/authSlice"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"
import { Separator } from "../../ui/separator"
import { toast } from "react-toastify"
import { X, Save, Edit3, Plus, AlertCircle, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

function UpdatePartenaire() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const partenaire = useSelector((state) =>
    state.partenaires.partenaires.find((p) => p._id === id)
  )
  const user = useSelector(loggedUser)

  // Form state
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState(null)
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null)
  const [hasLogo, setHasLogo] = useState(false)
  const [loading, setLoading] = useState(true)

  // For enhanced editable items (example: maybe partners have tags or something similar)
  const [tags, setTags] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const inputRefs = useRef({})

  // Helpers
  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  useEffect(() => {
    if (!partenaire) {
      dispatch(fetchPartenaireById(id))
    } else {
      setName(partenaire.name || "")
      setWebsite(partenaire.website || "")
      setDescription(partenaire.description || "")
      if (partenaire.logo?.url) {
        setLogoPreviewUrl(partenaire.logo.url)
        setHasLogo(true)
      }
      // Example: If partenaire has tags or similar array, parse here
      setLoading(false)
    }
  }, [partenaire, dispatch, id])

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    setLogo(file)
    setLogoPreviewUrl(URL.createObjectURL(file))
    setHasLogo(true)
  }

  const handleDragOver = (e) => e.preventDefault()

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    setLogo(file)
    setLogoPreviewUrl(URL.createObjectURL(file))
    setHasLogo(true)
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Le nom du partenaire est requis")
      return
    }

    const formData = new FormData()
    formData.append("name", name)
    formData.append("website", website)
    formData.append("description", description)
    if (logo instanceof File) {
      formData.append("logo", logo)
    }

    setLoading(true)
    try {
      await dispatch(updatePartenaire({ id, formData })).unwrap()
      toast.success("Partenaire mis à jour avec succès !")
      setTimeout(() => navigate("/partenaires"), 1000)
    } catch (error) {
      toast.error(error || "Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-lg font-semibold text-gray-700">
                  Nom du Partenaire
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entrez le nom du partenaire"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="website" className="text-lg font-semibold text-gray-700">
                  Site Web
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://exemple.com"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <Label htmlFor="logo-upload" className="text-lg font-semibold text-gray-700">
                Logo
              </Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                  hasLogo && !logo ? "hidden" : "border-gray-300 hover:border-blue-500 transition-colors duration-300"
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("logo-upload").click()}
              >
                <p className="text-gray-600">Glissez-déposez votre logo ici ou cliquez pour sélectionner</p>
                <input
                  id="logo-upload"
                  name="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="sr-only"
                />
              </div>
              {logoPreviewUrl && (
                <div className="relative">
                  <img
                    src={logoPreviewUrl}
                    alt="Aperçu du logo"
                    className="w-full h-64 object-contain rounded-md shadow-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    onClick={() => {
                      setLogoPreviewUrl(null)
                      setHasLogo(false)
                      setLogo(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du partenaire"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/partenaires")} className="flex-1">
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdatePartenaire
