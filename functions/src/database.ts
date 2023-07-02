import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { RecipeDetails, RecipePreview, RecipePreviews } from "./database/Recipe";

const db = getFirestore();

export const updateRecipePreview = onDocumentWritten("recipeDetails/{recipeId}", (event) => {

    const recipeId = event.params.recipeId;

    console.log(`Recipe details changed for recipe with id ${recipeId}.`);

    const recipeDetails = event.data?.after?.data() as RecipeDetails;

    const recipePreviewsDocRef = db.doc(`aggregates/recipePreviews`);

    if (!recipeDetails) {
        // the recipe was deleted so we delete the preview
        console.log(`Deleting preview for recipe with id ${recipeId}.`);
        recipePreviewsDocRef.update({
            [recipeId]: FieldValue.delete()
        })

    } else {
        // the recipe was created/updated so we create/update the preview
        console.log(`Creating/Updating preview for recipe with id ${recipeId}.`);
        let recipePreview: RecipePreview = {
            name: recipeDetails.name,
            previewImage: recipeDetails.images[0] as string || null,
            keywords: [...recipeDetails.keywords],
        }

        recipePreviewsDocRef.update({
            [recipeId]: recipePreview
        });
    }

});

export const updateKeywords = onDocumentWritten("aggregates/recipePreviews", (event) => {

    console.log(`Recipe previews changed.`);

    const recipePreviews = event.data?.after?.data() as RecipePreviews;

    if (!recipePreviews) {
        return;

    }

    const keywordsDocRef = db.doc(`aggregates/keywords`);

    // the list of recipe previews was updated so we update the list of used keywords
    const newKeywords = [...new Set(Object.values(recipePreviews).flatMap((recipe) => recipe.keywords))];
    const newKeywordsMap = Object.fromEntries(newKeywords.map(kw => [kw, null]));
    console.log(`Updating list of used keywords.`);

    keywordsDocRef.set(newKeywordsMap);

});