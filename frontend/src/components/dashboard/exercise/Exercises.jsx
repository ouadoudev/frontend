import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../ui/table";
import { Button } from "../../ui/button";
import { fetchExercisesByLesson, deleteExercise } from "@/store/exerciseSlice";
import { fetchLesson } from "@/store/lessonSlice";
import { File, PlayIcon, TrashIcon } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";

import katex from "katex";
import "katex/dist/katex.min.css";

// Composant pour afficher le texte avec support KaTeX
const MathText = ({ text, dir = "ltr", className = "" }) => {
  if (!text) return null;

  const renderWithKaTeX = (content) => {
    // Regex pour trouver les formules LaTeX entre $$ ou $
    const latexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = latexRegex.exec(content)) !== null) {
      // Texte avant la formule
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }

      // La formule LaTeX (avec $$ ou $)
      const latexContent = match[1] || match[2];
      const isDisplayMode = match[1] !== undefined; // $$ pour mode display

      try {
        const html = katex.renderToString(latexContent, {
          displayMode: isDisplayMode,
          throwOnError: false,
          output: "html",
        });
        parts.push(
          <span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />
        );
      } catch (error) {
        console.error("Erreur KaTeX:", error);
        parts.push(`$${latexContent}$`);
      }

      lastIndex = match.index + match[0].length;
    }

    // Texte après la dernière formule
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <span dir={dir} className={className}>
      {renderWithKaTeX(text)}
    </span>
  );
};


const Exercises = () => {
  const { lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exercises, loading, error } = useSelector((state) => state.exercises);
  const lesson = useSelector((state) => state.lesson.lesson);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    if (lessonId) {
      dispatch(fetchExercisesByLesson(lessonId));
      dispatch(fetchLesson(lessonId));
    }
  }, [dispatch, lessonId]);

  const handleDelete = (exerciseId) => {
    setToDelete(exerciseId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!toDelete) return;
      await dispatch(deleteExercise(toDelete)).unwrap();
      toast.success("exercice supprimée avec succès", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Erreur lors de la suppression", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setShowDeleteConfirm(false);
      setToDelete(null);
    }
  };

  const handleEdit = async (exerciseId) => {
    navigate(`/exercise/edit/${exerciseId}`);
  };

  return (
    <div className="container my-8 overflow-hidden rounded-lg shadow-xs">
      <div className="w-full overflow-x-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Exercices pour {lesson?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <TableHead className="text-center px-4 py-2">
                    Titre de l'exercice
                  </TableHead>
                  <TableHead className="text-center px-4 py-2">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              {loading && <div>Chargement...</div>}
              {error && <div>Erreur : {error}</div>}
              <TableBody>
                {exercises && exercises.length > 0 ? (
                  exercises.map((exercise) => (
                    <TableRow
                      key={exercise._id}
                      className="text-gray-700 dark:text-gray-400"
                    >
                      <TableCell className="text-center px-4 py-2">
                       <MathText text={exercise?.title}/>
                      </TableCell>
                      <TableCell className="text-center px-4 py-2">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            className="h-8"
                            onClick={() => handleEdit(exercise._id)}
                          >
                            <File className="w-4 h-4 mr-1" />
                          </Button>
                          <Button
                            variant="outline"
                            className="h-8"
                            onClick={() => handleDelete(exercise._id)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="2" className="text-center px-4 py-2">
                      No exercises found for this lesson.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <ConfirmDialog
        show={showDeleteConfirm}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette exercice ? Cette action est irréversible."
        onCancel={() => {
          setShowDeleteConfirm(false);
          setToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        confirmText="Supprimer"
        cancelText="Annuler"
        destructive
      />
    </div>
  );
};

export default Exercises;
