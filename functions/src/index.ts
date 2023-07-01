/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2/options";

// we need to initialize the app before importing the functions as initialization 
// code in theses files may rely on the app being initialized
initializeApp();

setGlobalOptions({ maxInstances: 2, region: 'europe-west1' });

import { fetchRecipe, fetchRecipesFromAllUserCollections } from "./chefkoch";
import { downloadFile } from "./download";
import { updateRecipePreview } from "./database";

export { fetchRecipe, fetchRecipesFromAllUserCollections, downloadFile, updateRecipePreview };

