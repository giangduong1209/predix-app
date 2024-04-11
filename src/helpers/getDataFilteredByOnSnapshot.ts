import { db } from "@/lib/db";
import {
  DocumentData,
  QueryConstraint,
  Unsubscribe,
  WhereFilterOp,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const getDataFileredByOnSnapshot = (
  collectionName: string,
  filters: [string, WhereFilterOp, string | number | boolean | string[]][],
  onSnapshotCallback: (docs: DocumentData[]) => void,
  orderByFields?: { field?: string; direction?: "asc" | "desc" }[],
  limitNumber?: number
) => {
  const collectionRef = collection(db, collectionName);
  let unsubscribe: Unsubscribe | undefined | DocumentData[];

  const queryFilters = filters.reduce(
    (acc: QueryConstraint[], [field, operator, conditional]) => {
      acc.push(where(field, operator, conditional));
      return acc;
    },
    []
  );

  if (orderByFields && orderByFields[0].direction) {
    orderByFields?.forEach((orderByField) => {
      queryFilters.push(orderBy(orderByField.field!, orderByField.direction));
    });
  }

  if (limitNumber) {
    queryFilters.push(limit(limitNumber));
  }

  unsubscribe = onSnapshot(
    query(collectionRef, ...queryFilters),
    (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => doc.data());
      onSnapshotCallback(data);
    }
  );

  return unsubscribe;
};

export default getDataFileredByOnSnapshot;
