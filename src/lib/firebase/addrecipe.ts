
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase.client";
import type { Recipe, RecipePreview } from "$lib/database/Recipe";

export const addRecipe = async (recipePreview: RecipePreview): Promise<string> => {

    if (!auth.currentUser) {
        throw Error('Unable to get current user id!')
    }

    const collectionRef = collection(db, "recipes");
    const docRef = doc(collectionRef);
    const newId = docRef.id;

    const recipe: Recipe = {
        ...recipePreview,
        id: newId,
        addedTimestamp: serverTimestamp(),
        addedBy: auth.currentUser?.uid
    }

    return setDoc(docRef, recipe).then(() => {
        console.log("Document written with ID: ", newId);
        return newId;
    }).catch(function (error) {
        throw Error("Error adding document: ", error);
    });

}