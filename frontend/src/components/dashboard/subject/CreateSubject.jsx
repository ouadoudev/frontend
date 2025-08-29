import { useState } from "react"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux"
import { addSubject } from "@/store/subjectSlice"
import { Label } from "../../ui/label"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"
import { BookOpenIcon, Plus, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CreateSubject = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [objectives, setObjectives] = useState([])
  const [loading, setLoading] = useState(false)
  const [newSubject, setNewSubject] = useState({
    title: "",
    description: "",
    price: "",
    educationalCycle: "",
    educationalLevel: "",
    stream: "",
    objectives: [],
  })

  const educationalLevels = {
    Primaire: [
      "1ère année Primaire",
      "2ème année Primaire",
      "3ème année Primaire",
      "4ème année Primaire",
      "5ème année Primaire",
      "6ème année Primaire",
    ],
    Collège: ["1ère année collège", "2ème année collège", "3ème année collège"],
    Lycée: ["Tronc Commun", "1ère année du Baccalauréat", "2ème année du Baccalauréat"],
  }

  const streams = {
    "Tronc Commun": ["Sciences", "Lettres et Sciences Humaines", "Technologies"],
    "1ère année du Baccalauréat": [
      "Sciences Mathématiques",
      "Sciences Expérimentales",
      "Sciences et Technologies Électriques",
      "Sciences et Technologies Mécaniques",
      "Lettres et Sciences Humaines",
      "Sciences Économiques et Gestion",
    ],
    "2ème année du Baccalauréat": [
      "Sciences Mathématiques A",
      "Sciences Mathématiques B",
      "Sciences Physiques",
      "Sciences de la Vie et de la Terre",
      "Sciences Agronomiques",
      "Sciences et Technologies Électriques",
      "Sciences et Technologies Mécaniques",
      "Lettres",
      "Sciences Humaines",
      "Sciences Économiques",
      "Techniques de Gestion et Comptabilité",
    ],
  }

  const getDirection = (text) => {
    const rtlChars = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/
    return rtlChars.test(text) ? "rtl" : "ltr"
  }

  const handleAddSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await dispatch(addSubject({ ...newSubject, objectives })).unwrap()
      toast.success("Subject created successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      })
      setTimeout(() => navigate("/subjects"), 1000)
    } catch (error) {
      toast.error("Error creating subject", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleObjectiveChange = (index, value) => {
    const updatedObjectives = [...objectives]
    updatedObjectives[index] = value
    setObjectives(updatedObjectives)
  }

  const addObjectiveField = () => {
    setObjectives([...objectives, ""])
  }

  const removeObjectiveField = (index) => {
    const updatedObjectives = [...objectives]
    updatedObjectives.splice(index, 1)
    setObjectives(updatedObjectives)
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleAddSubmit}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Subject</h1>
            <p className="text-gray-600">Add a new educational subject to your platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-lg font-semibold text-gray-700">
                  <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
                  Subject Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={newSubject.title}
                  dir={getDirection(newSubject.title)}
                  onChange={(event) =>
                    setNewSubject({
                      ...newSubject,
                      title: event.target.value,
                    })
                  }
                  placeholder="Enter subject title"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-lg font-semibold text-gray-700">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newSubject.price}
                  onChange={(event) =>
                    setNewSubject({
                      ...newSubject,
                      price: event.target.value,
                    })
                  }
                  placeholder="Enter price (leave empty for free)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="educationalCycle" className="text-lg font-semibold text-gray-700">
                  Educational Cycle
                </Label>
                <select
                  id="educationalCycle"
                  value={newSubject.educationalCycle}
                  onChange={(event) =>
                    setNewSubject({
                      ...newSubject,
                      educationalCycle: event.target.value,
                      educationalLevel: "",
                      stream: "",
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  <option value="">Select Educational Cycle</option>
                  <option value="Primaire">Primaire</option>
                  <option value="Collège">Collège</option>
                  <option value="Lycée">Lycée</option>
                </select>
              </div>

              {newSubject.educationalCycle && (
                <div>
                  <Label htmlFor="educationalLevel" className="text-lg font-semibold text-gray-700">
                    Educational Level
                  </Label>
                  <select
                    id="educationalLevel"
                    value={newSubject.educationalLevel}
                    onChange={(event) =>
                      setNewSubject({
                        ...newSubject,
                        educationalLevel: event.target.value,
                        stream: "",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select Educational Level</option>
                    {educationalLevels[newSubject.educationalCycle]?.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {newSubject.educationalCycle === "Lycée" && newSubject.educationalLevel && (
                <div>
                  <Label htmlFor="stream" className="text-lg font-semibold text-gray-700">
                    Stream
                  </Label>
                  <select
                    id="stream"
                    value={newSubject.stream}
                    onChange={(event) =>
                      setNewSubject({
                        ...newSubject,
                        stream: event.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select Stream</option>
                    {streams[newSubject.educationalLevel]?.map((stream) => (
                      <option key={stream} value={stream}>
                        {stream}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-lg font-semibold text-gray-700">
                  <BookOpenIcon className="inline-block mr-2 h-5 w-5" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newSubject.description}
                  dir={getDirection(newSubject.title)}
                  onChange={(event) =>
                    setNewSubject({
                      ...newSubject,
                      description: event.target.value,
                    })
                  }
                  placeholder="Enter subject description"
                  className="mt-1 min-h-[200px]"
                />
              </div>
            </div>
          </div>

          {/* Objectives Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-gray-700">Subject Objectives</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addObjectiveField}
                className="flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Objective
              </Button>
            </div>

            {objectives.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-sm">No objectives added yet</p>
                <p className="text-xs text-gray-400 mt-1">Click "Add Objective" to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={objective}
                     dir={getDirection(newSubject.title)}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder={`Objective ${index + 1}`}
                      className="w-full"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeObjectiveField(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/subjects")} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
            >
              {loading ? "Creating..." : "Create Subject"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateSubject
