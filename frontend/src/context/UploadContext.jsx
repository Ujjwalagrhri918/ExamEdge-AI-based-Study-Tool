import { createContext, useState, useEffect, useContext } from "react";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../auth/AuthContext"
// Create context
export const UploadContext = createContext();

// Provider component
export const UploadProvider = ({ children }) => {
  const [uploads, setUploads] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const URL = "https://e927-34-70-150-136.ngrok-free.app";

  const { db, user } = useAuth();

  // Load uploads from Firestore on mount
  useEffect(() => {
    if (user) {
      const fetchUploads = async () => {
        const uploadsRef = collection(db, "users", user.uid, "uploads");
        const uploadSnapshot = await getDocs(uploadsRef);
        const uploadList = uploadSnapshot.docs.map(doc => doc.data());
        setUploads(uploadList);
      };

      fetchUploads();
    }
  }, [db, user]);

  // Add new upload to Firestore
  const addUpload = async (upload) => {
    if (user) {
      try {
        const uploadsRef = collection(db, "users", user.uid, "uploads");
        await addDoc(uploadsRef, upload);
        setUploads(prevUploads => [...prevUploads, upload]);
      } catch (error) {
        console.error("Error adding upload:", error);
      }
    }
  };

  // Fetch summary from Firebase or make API call
  const fetchSummary = async (uniqueFilename) => {
    if (!user) return null;

    try {
      // Check Firebase first
      const summaryRef = doc(db, 'users', user.uid, 'summary', uniqueFilename);
      const docSnap = await getDoc(summaryRef);

      if (docSnap.exists()) {
        // If summary exists in Firebase, return it
        return docSnap.data().details;
      } else {
        // If no summary in Firebase, fetch from API
        const response = await fetch(
          `${URL}/generate-summary/${uniqueFilename}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch summary from API');
        }

        const data = await response.json();

        // Save to Firebase for future use
        await setDoc(summaryRef, {
          unique: uniqueFilename,
          details: data,
        });

        return data;
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      return null;
    }
  };

  // Select a file by unique name
  const selectFile = (uniqueFilename) => {
    setSelectedFile(uniqueFilename);
  };

// Delete a file and its associated keys from localStorage and state
const deleteFile = async (uniqueId) => {
  if (!user) return;

  try {
    // Delete file from Firestore where unique field matches uniqueId
    const uploadsRef = collection(db, "users", user.uid, "uploads");
    const q = query(uploadsRef, where("unique", "==", uniqueId));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (docSnap) => {
      const docRef = doc(db, "users", user.uid, "uploads", docSnap.id);
      await deleteDoc(docRef);
    });

    // Remove from uploads state
    const updatedUploads = uploads.filter((file) => file.unique !== uniqueId);
    setUploads(updatedUploads);

    // Remove from localStorage
    localStorage.setItem("uploads", JSON.stringify(updatedUploads));

    // Keys to remove from localStorage
    const keysToRemove = [
      `${uniqueId}_summary`,
      `${uniqueId}_mcqs`,
      `videos-${uniqueId}`,
      `books-${uniqueId}`,
    ];

    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error("Error deleting file:", error);
  }
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
        URL,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
};
