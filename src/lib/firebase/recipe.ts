
import { auth, db, httpsCallable } from "./firebase.client";
import { collection, setDoc, doc, serverTimestamp, getDocFromServer, getDoc, getDocs, query, where, deleteDoc } from "firebase/firestore";
import { type RecipeDetails, type RecipeDraft, getEmptyRecipeDraft, type RecipePreviews } from "$lib/database/Recipe";
import { getDownloadURL, getStorage, ref, uploadBytes, type StorageReference } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { PUBLIC_FIREBASE_STORAGE_URL } from '$env/static/public';

const aggregatesCollectionRef = collection(db, "aggregates");
const recipeDetailsCollectionRef = collection(db, "recipeDetails");

export const getExistingOrNewRecipeDetailsRef = (recipeId: string | null) => {
    if (recipeId != null) {
        return getExistingRecipeDetailsRef(recipeId);
    } else {
        return doc(recipeDetailsCollectionRef);
    }
}

export const getExistingRecipeDetailsRef = (recipeId: string) => {
    return doc(recipeDetailsCollectionRef, recipeId);
}

export const getRecipePreviewsRef = () => {
    return doc(aggregatesCollectionRef, "recipePreviews");
}

export const getKeywordsRef = () => {
    return doc(aggregatesCollectionRef, "keywords");
}

export const getRecipeDetails = async (recipeId: string, fromServer: boolean = false) => {
    const recipeRef = getExistingOrNewRecipeDetailsRef(recipeId);

    const recipeDocumentPromise = fromServer ? getDocFromServer(recipeRef) : getDoc(recipeRef);
    const recipeDocument = await recipeDocumentPromise.then(document => document.data() as RecipeDetails);

    if (recipeDocument) {
        return recipeDocument;
    }

    throw Error(`Unable to find details for recipe with id ${recipeId} in database!`);
}

export const getAllRecipePreviews = async () => {
    const recipePreviewsRef = getRecipePreviewsRef();
    return getDoc(recipePreviewsRef).then(document => document.data() as RecipePreviews);
}

export const getAllKeywords = async () => {

    const keywordsRef = getKeywordsRef();
    return getDoc(keywordsRef).then(document => document.data() as Map<string, any>).then(d => Object.keys(d));
}

export const checkRecipeWithSourceIdDoesNotYetExist = async (sourceId: string | number): Promise<boolean> => {
    const q = query(recipeDetailsCollectionRef, where("sourceId", "==", sourceId));
    return await getDocs(q).then(snapshot => snapshot.docs).then(documents => documents && documents.length > 0);
}

export const addRecipe = async (recipeDraft: RecipeDraft | RecipeDetails): Promise<string> => {

    if (!auth.currentUser) {
        throw Error('Unable to get current user id!')
    }

    // either get the existing document (if the provided draft already represents a recipe) or create a new document
    const docRef = getExistingOrNewRecipeDetailsRef((recipeDraft as RecipeDetails)?.id || null);
    const docId = docRef.id;

    const existingOrEmptyDocoument = await getRecipeDetails(docId, true).then(recipe => recipe).catch(() => getEmptyRecipeDraft());

    const recipe: RecipeDetails = {
        ...existingOrEmptyDocoument,
        ...recipeDraft,
        id: docId,
        addedTimestamp: serverTimestamp(),
        addedBy: auth.currentUser?.uid,
        images: []
    }

    const storage = getStorage();
    const recipeImagesRef = ref(storage, `images/${docId}`);

    for (const image of recipeDraft.images) {
        let imageUrl;
        if (existingOrEmptyDocoument.images.includes(image)) {
            imageUrl = image;
        } else {
            imageUrl = await moveImageToStorage(image, recipeImagesRef);
        }
        if (imageUrl) {
            recipe.images.push(imageUrl);
        }
        // FIXME we should also remove deleted images from storage
    }


    return setDoc(docRef, recipe).then(() => {
        console.log("Document written with ID: ", docId);
        return docId;
    }).catch(function (error) {
        throw Error("Error adding document: ", error);
    });

}

export const deleteRecipe = async (recipeId: string) => {

    if (!auth.currentUser) {
        throw Error('Unable to get current user id!')
    }

    const docRef = getExistingRecipeDetailsRef(recipeId);

    return deleteDoc(docRef).then(() => {
        console.log("Document deleted with ID: ", recipeId);
    }).catch((error) => {
        throw Error("Error deleting document: ", error.message);
    });
}

const moveImageToStorage = async (recipeImage: (string | File), folderRef: StorageReference) => {
    if (typeof (recipeImage) !== 'string') {
        // a local image from the file system
        // -> upload to our bucket
        return uploadLocalImageToStorage(recipeImage as File, folderRef);
    } else {
        // the image is from an external source (not yet at the correct location)
        // -> copy to our bucket
        return copyRemoteImageToStorage(recipeImage, folderRef);
    }
}

const uploadLocalImageToStorage = async (image: File, folderRef: StorageReference): Promise<string> => {
    const imageFileExtension = image.name.split('.').pop();
    return uploadImageToStorage(image, `${uuidv4()}.${imageFileExtension}`, folderRef);
};

export interface DownloadedFile {
    dataUrl: string;
    contentType: string;
};

const downloadFileCallable = httpsCallable('downloadFile');
const knownImageExtensions = ["JPG", "JPEG", "JPE", "BMP", "GIF", "PNG"];

const copyRemoteImageToStorage = async (imageUrl: string, folderRef: StorageReference): Promise<string> => {

    const downloadedFile = await downloadFileCallable({ url: imageUrl }).then(result => result.data as DownloadedFile).catch(error => {
        throw Error(`The following error occurred while trying to download image from URL ${imageUrl}: ${error.message || ''}`);
    });

    let imageFileExtension = imageUrl.split('.').pop() || '';

    let isKnownImageExtension = knownImageExtensions.includes(imageFileExtension?.toUpperCase());
    if (!isKnownImageExtension) {

        let isImageContentType = downloadedFile.contentType?.startsWith('image/');
        if (isImageContentType) {
            imageFileExtension = downloadedFile.contentType.replace('image/', '');
        } else {
            throw Error("Unable to determine type of downloaded image (png, jpg, ...)!");
        }
    }

    const imageBlob = await fetch(downloadedFile.dataUrl).then(res => res.blob());

    return uploadImageToStorage(imageBlob, `${uuidv4()}.${imageFileExtension}`, folderRef);
}

const uploadImageToStorage = async (image: Blob, imageName: string, folderRef: StorageReference): Promise<string> => {
    const recipeImageRef = ref(folderRef, imageName);
    return uploadBytes(recipeImageRef, image).then((snapshot) => {
        console.log('Uploaded a blob or file!', snapshot);
        return getDownloadURL(recipeImageRef).then(downloadUrl => {
            return downloadUrl.replace(PUBLIC_FIREBASE_STORAGE_URL, '')
        });
    });
};

export const updateRecipe = async (recipe: RecipeDetails): Promise<string> => {

    return addRecipe(recipe);
}