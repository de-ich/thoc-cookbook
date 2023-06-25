const { getFirestore } = require('firebase-admin/firestore');
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { RecipeDetails, RecipePreview } from "./database/Recipe";

const db = getFirestore();

export const updateRecipePreview = onDocumentWritten("recipeDetails/{recipeId}", (event) => {

    const recipeId = event.params.recipeId;

    console.log(`Recipe details changed for recipe with id ${recipeId}.`);

    const recipeDetails = event.data?.after?.data() as RecipeDetails;
    const recipePreviewDocRef = db.doc(`recipePreviews/${recipeId}`);

    if (!recipeDetails) {
        // the recipe was deleted so we delete the preview
        console.log(`Deleting preview for recipe with id ${recipeId}.`);
        recipePreviewDocRef.delete();

    } else {
        // the recipe was created/updated so we create/update the preview
        console.log(`Creating/Updating preview for recipe with id ${recipeId}.`);
        let recipePreview: RecipePreview = {
            id: recipeDetails.id,
            name: recipeDetails.name,
            previewImage: recipeDetails.images[0] as string || null,
            keywords: [...recipeDetails.keywords],
            addedBy: recipeDetails.addedBy,
            addedTimestamp: recipeDetails.addedTimestamp
        }

        recipePreviewDocRef.set(recipePreview);
    }

});