import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db, storage } from "./firebase";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";

 interface sessionProps {
    context:string
    messages: any
    sessionType:string
    contextType:string
    sessionTitle:string
    fileUrl:string
}

// Create a new session
const createSession = async ({context,messages,sessionType,contextType,sessionTitle,fileUrl}: sessionProps,userId:string): Promise<string | null> => {
    try {
        const sessionCollectionRef = collection(db,"users",userId ,"sessions");
        const sessionDocRef = await addDoc(sessionCollectionRef, {sessionTitle,sessionType,contextType,context,fileUrl,messages});
       
        return sessionDocRef.id;
    } catch (error) {
        console.log("Error creating session:", error);
        return null;
    }
};

// Get session data based on session ID
const getSession = async (sessionId: string,userId:string): Promise<any> => {
    try {
        const docSnap = await getDoc(doc(db,"users",userId , "sessions", sessionId));
        if (docSnap.exists()) {
            // console.log("this is data")
            // console.log(docSnap.data().messages)
            return docSnap.data() ;
        } else {
            console.log("Session History not found");
            return undefined;
        }
    } catch (error) {
        console.log("Error getting session:", error);
        return undefined;
    }
};

// Update an existing session
const updateSession = async (sessionId:string,messages:any,userId:string): Promise<boolean> => {
    if (!sessionId) {
        console.log("Session ID is required for updating");
        return false;
    }

    try {
        const sessionRef = doc(db,"users",userId , 'sessions', sessionId);
        await updateDoc(sessionRef, {
            messages
        });
        return true;
    } catch (error) {
        console.log("Error updating session:", error);
        return false;
    }
};

//Fucntions for hsitory
// interface historyProp{
//     sessionId:string
//     title:string
// }
// const updateHistory = async (array: historyProp[],userId:string): Promise<boolean> => {
//     try {
//       const historyRef = doc(db,"users",userId, "historyDoc"); // Refer to a specific document within the collection
//       await setDoc(historyRef, { history: array }, { merge: true }); // Wrap the array in an object
//       return true;
//     } catch (error) {
//       console.error("Error updating history:", error);
//       return false;
//     }
//   };

// const getHistory=async (userId:string):Promise<any>=>{
//     const docSnap=await getDoc(doc(db,"users",userId ,"historyDoc"));
//     if(docSnap.exists()){
//         console.log(docSnap.data())
//         return docSnap.data().history
//     }
//     else{
//         return null
//     }
// }

interface Session {
    sessionId: string;
    title: string;
    sessionType: string;
    contextType: string;
    // Add other fields as necessary
  }
  
  export async function getUserSessions(userId: string): Promise<Session[]> {
    try {
      const sessionsRef = collection(db, 'users', userId, 'sessions');
      const querySnapshot = await getDocs(sessionsRef);
      
      const sessions = querySnapshot.docs.map(doc => ({
        sessionId: doc.id,
        title: doc.data().sessionTitle || 'Untitled Session',
        sessionType: doc.data().sessionType,
        contextType: doc.data().contextType,
        // Add other fields as necessary
      }));
  
    //   console.log('Fetched sessions:', sessions); // Debug log
  
      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error; // Re-throw the error so it can be handled by the caller
    }
  }

  async function uploadPdfToFirebase(base64Data: string, fileName: string): Promise<string> {
    try {
      // Create a reference to the location where we want to upload the file
      const storageRef = ref(storage, 'pdfs/' + fileName);
  
      // Upload the base64 data to Firebase Storage
      const snapshot = await uploadString(storageRef, base64Data, 'data_url');
  
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file: ", error);
      throw error;
    }
  }
// const uploadFile=async ():Promise<any>=>{
    // const fileBuffer=fs.readFileSync(outputFilePath)
    // const storageRef=ref(storage, `audio/${path.basename(outputFilePath)}`)
    // const metadata = {
    //   contentType: 'audio/mp3'
    // };

    // await uploadBytes(storageRef,fileBuffer,metadata);
    // const publicURL=await getDownloadURL(storageRef)
// }

export { createSession, getSession, updateSession,uploadPdfToFirebase };
export type { sessionProps };
