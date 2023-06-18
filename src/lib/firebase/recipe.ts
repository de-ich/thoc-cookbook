
import { collection, setDoc, doc, serverTimestamp, getDocFromServer, getDoc } from "firebase/firestore";
import { auth, db, httpsCallable } from "./firebase.client";
import { type Recipe, type RecipePreview, getEmptyRecipePreview } from "$lib/database/Recipe";
import { getDownloadURL, getStorage, ref, uploadBytes, type StorageReference } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export const getRecipe = async (recipeId: string) => {
    const recipeRef = doc(db, 'recipes', recipeId);
    return getDoc(recipeRef).
        then(doc => doc.data() as Recipe)
        .catch(() => { throw Error(`Unable to find recipe with id ${recipeId} in database!`); })
        .then((data) => {
            return {
                recipe: data
            };
        });
}

export const addRecipe = async (recipePreview: RecipePreview | Recipe): Promise<string> => {

    if (!auth.currentUser) {
        throw Error('Unable to get current user id!')
    }

    const collectionRef = collection(db, "recipes");
    // either get the existing document (if the provided preview already represents a recipe) or create a new document
    let docRef;
    if ((recipePreview as Recipe)?.id) {
        docRef = doc(collectionRef, (recipePreview as Recipe).id);
    } else {
        docRef = doc(collectionRef);
    }
    const docId = docRef.id;

    const existingOrEmptyDocoument = await getDocFromServer(docRef).then(snapshot => snapshot.data() as Recipe) || getEmptyRecipePreview();

    const recipe: Recipe = {
        ...existingOrEmptyDocoument,
        ...recipePreview,
        id: docId,
        addedTimestamp: serverTimestamp(),
        addedBy: auth.currentUser?.uid,
        images: []
    }

    const storage = getStorage();
    const recipeImagesRef = ref(storage, `images/${docId}`);

    for (const image of recipePreview.images) {
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

const fetchRecipeCallable = httpsCallable('downloadFile');
const knownImageExtensions = ["JPG", "JPEG", "JPE", "BMP", "GIF", "PNG"];

const copyRemoteImageToStorage = async (imageUrl: string, folderRef: StorageReference): Promise<string> => {

    const downloadedFile = await fetchRecipeCallable({ url: imageUrl }).then(result => result.data) as DownloadedFile;

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
        return getDownloadURL(recipeImageRef)
    });
};

export const updateRecipe = async (recipe: Recipe): Promise<string> => {

    return addRecipe(recipe);
}