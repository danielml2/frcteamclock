import { initializeApp } from "firebase/app";
import { json } from '@sveltejs/kit'
import { getFirestore , runTransaction, getDoc, doc, updateDoc} from "firebase/firestore"

export function GET() {
  const firebaseConfig = {
    apiKey: "AIzaSyDlaAXrFNtkgcOMcjO4TrsBgvdTd-JOS7c",
    authDomain: "frcteamclock-counter.firebaseapp.com",
    projectId: "frcteamclock-counter",
    storageBucket: "frcteamclock-counter.appspot.com",
    messagingSenderId: "528853227081",
    appId: "1:528853227081:web:99023a4dee858c01989198"
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  const docRef = doc(firestore, "counters", "visitors")
  
    function decrementCount() {
        runTransaction(firestore, async (transaction) => {
          let docSnap = await transaction.get(docRef)
          transaction.update(docRef, { count: docSnap.data().count - 1})
        })
      }
   decrementCount()   

   return json({ applied: "Yes"})
}