import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { newResource } from "@/store/resourcesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "react-toastify";

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
  Lycée: [
    "Tronc Commun",
    "1ère année du Baccalauréat",
    "2ème année du Baccalauréat",
  ],
};

const streams = {
  "Tronc Commun": ["Sciences", "Lettres et Sciences Humaines", "Technologies"],
  "1ère année du Baccalauréat": [
    "Sciences Mathématiques",
    "Sciences Expérimentales",
    "Sciences et Technologies Électriques",
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
};

const validSubjects = [
  "Mathématiques",
  "Physique et Chimie",
  "Sciences de la Vie et de la Terre",
  "الفلسفة",
  "Informatique",
  "التاريخ والجغرافيا",
  "Français",
  "اللغة العربية",
  "English",
  "Español",
  "التربية الإسلامية",
  "Économie et comptabilité",
];

const CreateResource = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.resources.isLoading);
  const error = useSelector((state) => state.resources.error);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    educationalCycle: "",
    educationalLevel: "",
    stream: [],
    subject: "",
    pdf: null,
  });

  const handleInputChange = (e) => {
    const { name, value, options, type } = e.target;
    if (name === "stream" && type === "select-multiple") {
      const selectedValues = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Reset dependent fields when parent field changes
        ...(name === "educationalCycle"
          ? { educationalLevel: "", stream: "" }
          : {}),
        ...(name === "educationalLevel" ? { stream: "" } : {}),
      }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, pdf: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("educationalCycle", formData.educationalCycle);
    formDataToSend.append("educationalLevel", formData.educationalLevel);
    formData.stream.forEach((s) => {
      formDataToSend.append("stream", s);
    });
    formDataToSend.append("subject", formData.subject);
    if (formData.pdf) {
      formDataToSend.append("pdf", formData.pdf);
    }

    try {
      await dispatch(newResource(formDataToSend)).unwrap();
      toast.success("Ressource créée avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/resources");
    } catch (err) {
      toast.error(error || "Erreur lors de la création de la ressource", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const handleBack = () => {
    navigate("/resources");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <Card className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle>Créer une nouvelle ressource</CardTitle>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              Remplissez les champs pour ajouter une nouvelle ressource
              pédagogique.
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Titre
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Entrez le titre de la ressource"
                    required
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Entrez une description"
                    rows={4}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="pdf"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fichier PDF
                  </Label>
                  <Input
                    id="pdf"
                    name="pdf"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Matière
                  </Label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez une matière</option>
                    {validSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Type
                  </Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="Cours">Cours</option>
                    <option value="Exercice">Exercice</option>
                    <option value="Examen">Examen</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="educationalCycle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cycle éducatif
                  </Label>
                  <select
                    id="educationalCycle"
                    name="educationalCycle"
                    value={formData.educationalCycle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        educationalCycle: e.target.value,
                        educationalLevel: "",
                        stream: "",
                      })
                    }
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionnez un cycle</option>
                    <option value="Primaire">Primaire</option>
                    <option value="Collège">Collège</option>
                    <option value="Lycée">Lycée</option>
                  </select>
                </div>

                {formData.educationalCycle && (
                  <div>
                    <Label
                      htmlFor="educationalLevel"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Niveau éducatif
                    </Label>
                    <select
                      id="educationalLevel"
                      name="educationalLevel"
                      value={formData.educationalLevel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          educationalLevel: e.target.value,
                          stream: "",
                        })
                      }
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Sélectionnez un niveau</option>
                      {educationalLevels[formData.educationalCycle]?.map(
                        (level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

                {formData.educationalCycle === "Lycée" &&
                  formData.educationalLevel && (
                    <div>
                      <Label
                        htmlFor="stream"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Filière
                      </Label>
                      <select
                        id="stream"
                        name="stream"
                        multiple // Allow multiple selections
                        value={formData.stream}
                        onChange={handleInputChange} // Use the updated handleInputChange
                        className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        // `required` can be tricky with multiple selects; consider client-side validation for at least one selection
                      >
                        <option value="">
                          Sélectionnez une ou plusieurs filières
                        </option>
                        {streams[formData.educationalLevel]?.map((stream) => (
                          <option key={stream} value={stream}>
                            {stream}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Maintenez Ctrl (Windows) ou Cmd (Mac) enfoncé pour
                        sélectionner plusieurs filières.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Création en cours..." : "Créer la ressource"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateResource;
