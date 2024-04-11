import { db } from "@/lib/db";
import {
  DocumentData,
  Unsubscribe,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

const getAllData = (
  collectionName: string,

  onSnapshotCallback: (docs: DocumentData[]) => void
) => {
  const collectionRef = collection(db, collectionName);
  let unsubscribe: Unsubscribe | undefined | DocumentData[];

  unsubscribe = onSnapshot(query(collectionRef), (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => doc.data());
    onSnapshotCallback(data);
  });

  return unsubscribe;
};

export default getAllData;
