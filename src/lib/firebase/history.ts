import { collection } from "firebase/firestore";
import { db, httpsCallable } from "./firebase.client";

const aggregatesCollectionRef = collection(db, "aggregates");

const pushToHistoryCallable = httpsCallable('pushToHistory');

export const addEntryToHistory = async (recipeId : string) => {
    pushToHistoryCallable({recipeId: recipeId});
}
