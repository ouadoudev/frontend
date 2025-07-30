import { useState } from "react"
import { useDispatch } from "react-redux"
import { addPartenaire } from "@/store/partenaireSlice"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UploadCloudIcon, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const CreatePartenaire = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [description, setDescription] = useState("")
  const [logo, setLogo] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setLogo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setLogo(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Le nom du partenaire est obligatoire")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("website", website)
    formData.append("description", description)
    if (logo) formData.append("logo", logo)

    try {
      await dispatch(addPartenaire(formData)).unwrap()
      toast.success("Partenaire ajouté avec succès !")
      navigate("/partenaires")
    } catch (error) {
      toast.error("Erreur lors de l'ajout : " + (error || "Erreur inconnue"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Ajouter un Partenaire</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Nom du Partenaire</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Google, Microsoft..."
              required
            />
          </div>

          <div>
            <Label htmlFor="website">Site Web</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://exemple.com"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du partenaire"
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="logo">Logo</Label>
            <div
              className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById("logo").click()}
            >
              <UploadCloudIcon className="w-10 h-10 mx-auto text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">
                Glissez votre logo ici ou cliquez pour le sélectionner
              </p>
              <input
                id="logo"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>

            {preview && (
              <div className="relative mt-4">
                <img
                  src={preview}
                  alt="Aperçu du logo"
                  className="w-full h-48 object-contain border rounded-md"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => {
                    setLogo(null)
                    setPreview(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Ajout en cours..." : "Ajouter le Partenaire"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default CreatePartenaire
