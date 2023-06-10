
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, httpsCallable } from "./firebase.client";
import { type Recipe, type RecipePreview, getEmptyRecipePreview } from "$lib/database/Recipe";
import { getDownloadURL, getStorage, ref, uploadBytes, type StorageReference } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export const addRecipe = async (recipePreview: RecipePreview | Recipe): Promise<string> => {

    if (!auth.currentUser) {
        throw Error('Unable to get current user id!')
    }

    const collectionRef = collection(db, "recipes");
    // either get the existing document (if the provided preview already represents a recipe) or create a new document
    const docRef = doc(collectionRef, (recipePreview as Recipe).id);
    const docId = docRef.id;

    const recipe: Recipe = {
        ...getEmptyRecipePreview(),
        ...recipePreview,
        id: docId,
        addedTimestamp: serverTimestamp(),
        addedBy: auth.currentUser?.uid
    }

    const storage = getStorage();
    const recipeImagesRef = ref(storage, `images/${docId}`);

    recipe.images = await moveImagesToStorage(recipe.images, recipeImagesRef).catch((error) => console.log(error)) || [];

    return setDoc(docRef, recipe).then(() => {
        console.log("Document written with ID: ", docId);
        return docId;
    }).catch(function (error) {
        throw Error("Error adding document: ", error);
    });

}

const moveImagesToStorage = async (images: (string | File)[], folderRef: StorageReference) => {

    const moveImagePromises = images.map((recipeImage) => {
        if (typeof (recipeImage) !== 'string') {
            // a local image from the file system
            // -> upload to our bucket
            return uploadLocalImageToStorage(recipeImage as File, folderRef);
        } else if (!recipeImage.startsWith(folderRef.fullPath)) {
            // the image is from an external source (not yet at the correct location)
            // -> copy to our bucket
            return copyRemoteImageToStorage(recipeImage, folderRef);
        } else {
            // the image is already at the correct location
            // -> return the existing URL
            return new Promise<string>(() => recipeImage);
        }
    });

    return Promise.all(moveImagePromises);
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