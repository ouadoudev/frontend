// ExerciseAttachmentUpload.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // Import for routing
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, X, CheckCircle, AlertCircle, Trash2, ArrowLeft } from "lucide-react";
import { uploadAttachment, deleteAttachment, clearUploadState } from "@/store/exerciseSlice";

// Define accepted file types
const ACCEPTED_FILE_TYPES = {
  images: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  pdfs: ["application/pdf"],
  documents: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  audios: ["audio/mpeg", "audio/wav", "audio/ogg"],
};
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Helper function to get the correct icon/badge based on file type
const getFileIcon = (fileType) => {
  if (fileType.includes('image')) return 'Image';
  if (fileType.includes('pdf')) return 'PDF';
  if (fileType.includes('audio')) return 'Audio';
  if (fileType.includes('word') || fileType.includes('document')) return 'Document';
  return 'File';
};


export default function ExerciseAttachmentUpload() {
  const { exerciseId } = useParams(); // Get exerciseId from the URL path
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select relevant state from Redux
  const { loading, error, uploadSuccess, attachment } = useSelector((state) => state.exercises);
  
  // Local state for file management
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); 
  const fileInputRef = useRef(null);

  // Use the actual attachment from Redux state for display
  const displayAttachment = attachment; 

// ---------------------------------------------------------------------

  const validateFile = (file) => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`);
      return false;
    }
    
    const acceptedMimeTypes = Object.values(ACCEPTED_FILE_TYPES).flat();
    if (!acceptedMimeTypes.includes(file.type)) {
        alert(`File type ${file.type} is not supported.`);
        return false;
    }
    
    return true;
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadProgress(0);
        dispatch(clearUploadState()); 
      } else {
        setSelectedFile(null);
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

// ---------------------------------------------------------------------
    
  /**
   * FIX: This function now correctly passes an object payload 
   * { exerciseId, file, onProgress } to the Redux thunk, 
   * which prevents exerciseId from being 'undefined'.
   */
  const handleUpload = useCallback(async () => {
    if (!selectedFile || !exerciseId) {
      dispatch({ 
        type: 'exercises/uploadAttachment/rejected', 
        payload: { message: "No file selected or Exercise ID is missing." }
      });
      return;
    }

    setUploadProgress(1); // Start progress bar

    try {
        // Correctly pass the payload object
        await dispatch(uploadAttachment({
            exerciseId: exerciseId, 
            file: selectedFile,      
            onProgress: setUploadProgress 
        })).unwrap();
        
        // Success logic is handled by the useEffect hook
        
    } catch (err) {
        setUploadProgress(0); // Reset on failure
        console.error("Upload failed:", err);
    }
  }, [selectedFile, exerciseId, dispatch]);

// ---------------------------------------------------------------------

  const handleDelete = () => {
    dispatch(deleteAttachment(exerciseId));
  };
  
  const handleCancel = () => {
    navigate(-1); 
  };

  useEffect(() => {
    // Clear state on component mount
    dispatch(clearUploadState());
  }, [exerciseId, dispatch]);

  useEffect(() => {
    if (uploadSuccess) {
      setUploadProgress(100);
      // Wait for the user to see the success message then navigate
      setTimeout(() => {
        // Navigate to the newly created exercise's view page or list
        navigate(`/lessons`); 
        dispatch(clearUploadState());
      }, 2000); 
    }
  }, [uploadSuccess, navigate, exerciseId, dispatch]);


// ---------------------------------------------------------------------

  return (
    <div className="container max-w-2xl py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Upload className="h-6 w-6 mr-3 text-blue-600" />
            Upload Exercise Attachment
          </CardTitle>
          <CardDescription>
            Attach a document, image, or audio file to exercise ID: **{exerciseId}**
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(',')}
            className="hidden" 
          />
          
          {/* Display Current Attachment if it exists */}
          {displayAttachment?.file?.public_id && (
            <div className="p-4 border rounded-lg bg-yellow-50 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <File className="h-6 w-6 text-yellow-600" />
                    <div>
                        <p className="font-medium text-sm">Current Attachment: {displayAttachment.file.originalname}</p>
                        <Badge variant="secondary" className="mt-1">{getFileIcon(displayAttachment.file.mimetype)}</Badge>
                    </div>
                </div>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                </Button>
            </div>
          )}

          {/* File Selection Area */}
          {!selectedFile && !displayAttachment?.file?.public_id && (
            <div 
              onClick={openFileDialog} 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFileChange({ target: { files: e.dataTransfer.files } });
              }}
              className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <Upload className="h-8 w-8 mx-auto mb-3 text-gray-500" />
              <p className="text-gray-600">Drag 'n' drop a file here, or <span className="text-blue-600 font-medium">click to select file</span></p>
              <p className="text-xs text-gray-500 mt-1">Max size: {MAX_FILE_SIZE / 1024 / 1024}MB. Supported types: Image, PDF, Document, Audio.</p>
            </div>
          )}
          
          {/* Selected File Preview and Action */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                <div className="flex items-center space-x-3">
                    <File className="h-6 w-6 text-gray-600" />
                    <div>
                        <p className="font-medium text-sm">{selectedFile.name}</p>
                        <Badge variant="secondary" className="mt-1">{getFileIcon(selectedFile.type)}</Badge>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={removeSelectedFile} disabled={loading}>
                    <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-4">
                <Button 
                    onClick={handleUpload} 
                    disabled={loading || uploadSuccess} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                    {loading && uploadProgress < 100 ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Uploading...
                        </>
                    ) : uploadSuccess ? (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Upload Complete
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4 mr-2" />
                            Start Upload
                        </>
                    )}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={loading} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Exercise
                </Button>
              </div>
            </div>
          )}

          {/* Progress and Messages */}
          {(loading || uploadProgress > 0) && uploadProgress < 100 && (
            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress <= 1 ? 'Preparing...' : `${uploadProgress}%`}</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {uploadSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">File uploaded successfully! Redirecting...</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error?.message || "Upload failed. Please try again."}</AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>
    </div>
  );
}