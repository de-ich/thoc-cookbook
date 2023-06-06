
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase.client";
import { type Recipe, type RecipePreview, getEmptyRecipePreview } from "$lib/database/Recipe";

export const addRecipe = async (recipePreview: RecipePreview): Promise<string> => {

    if (!auth.currentUser) {
        throw Error('Unable to get current user id!')
    }

    const collectionRef = collection(db, "recipes");
    const docRef = doc(collectionRef);
    const newId = docRef.id;

    const recipe: Recipe = {
        ...getEmptyRecipePreview(),
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

export const updateRecipe = async (recipe: Recipe): Promise<string> => {

    if (!auth.currentUser) {
        throw Error('Unable to get current user id!')
    }

    const collectionRef = collection(db, "recipes");
    const docRef = doc(collectionRef, recipe.id);

    return setDoc(docRef, recipe).then(() => {
        console.log("Document update with ID: ", recipe.id);
        return recipe.id;
    }).catch(function (error) {
        throw Error("Error adding document: ", error);
    });

}