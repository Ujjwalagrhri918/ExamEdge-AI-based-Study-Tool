import { createContext, useState, useEffect } from "react";

// Create context
export const UploadContext = createContext();

// Provider component
export const UploadProvider = ({ children }) => {
  // Store all uploads from localStorage
  const [uploads, setUploads] = useState([]);

  // Store the unique filename of the selected PDF
  const [selectedFile, setSelectedFile] = useState(null);

  // Load uploads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("uploads");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setUploads(parsed);
        }
      } catch (e) {
        console.error("Failed to parse local uploads:", e);
      }
    }
  }, []);

  // Add new upload
  const addUpload = (upload) => {
    const updatedUploads = [...uploads, upload];
    localStorage.setItem("uploads", JSON.stringify(updatedUploads));
    setUploads(updatedUploads);
  };

  // Select a file by unique name
  const selectFile = (uniqueFilename) => {
    setSelectedFile(uniqueFilename);
  };

  // Delete a file and its associated keys from localStorage and state
  const deleteFile = (uniqueId) => {
    const updatedUploads = uploads.filter((file) => file.unique !== uniqueId);
    setUploads(updatedUploads);
    localStorage.setItem("uploads", JSON.stringify(updatedUploads));

    const keysToRemove = [
      `${uniqueId}_summary`,
      `${uniqueId}_mcqs`,
      `videos-${uniqueId}`,
      `books-${uniqueId}`,
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  };

  return (
    <UploadContext.Provider
      value={{
        uploads,
        setUploads, // exposed in case it's needed
        addUpload,
        selectedFile,
        selectFile,
        deleteFile, // <- Expose deleteFile to context consumers
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
