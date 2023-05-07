import { initializeApp, getApps } from "firebase-admin/app";
import { json } from "@sveltejs/kit";
import { error} from '@sveltejs/kit';
import { getFirestore,  runTransaction, doc } from "firebase/firestore";

export async function GET() {
  try {
    const app = getApps().length == 0 ? initializeApp() : getApps()[0]
    const firestore = getFirestore();
    const docRef = doc(firestore, "counters", "visitors");

    await runTransaction(firestore, async (transaction) => {
      let docSnap = await transaction.get(docRef);
      transaction.update(docRef, { count: docSnap.data().count - 1 });
    }).then(() => {
      return json({"Success!": ""})
    });
  } catch (e) {
    throw error(404, {
      message: e
    })
  }
   

  return json({})
}
