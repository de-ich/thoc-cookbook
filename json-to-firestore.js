import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

// Initialize Cloud Firestore through Firebase
const app = initializeApp({
    apiKey: "AIzaSyDT7gYEMfLvQw1BrdqDCaS-HHx-lPSreI8",
    authDomain: "thoc-cookbook.firebaseapp.com",
    projectId: "thoc-cookbook"
});

var db = getFirestore(app);

var recipe = {
    "images": [
        "https://img.chefkoch-cdn.de/rezepte/2627441412753172/bilder/1176523/crop-960x540/blumenkohlpueree-mit-hackfleischtopping.jpg"
    ],
    "ingredients": [
        {
            "count": 1,
            "name": "Blumenkohl , ca. 1,5 kg"
        },
        {
            "count": 1,
            "name": "Becher Crème fraiche"
        },
        {
            "name": "Muskat"
        },
        {
            "count": 2,
            "name": "mittelgroße Zwiebeln"
        },
        {
            "count": 1,
            "name": "Stange Lauch"
        },
        {
            "count": 500,
            "unit": "g",
            "name": "Hackfleisch, gemischtes"
        },
        {
            "name": "Salz und Pfeffer"
        },
        {
            "name": "Paprikapulver"
        },
        {
            "name": "Petersilie, frische"
        }
    ],
    "name": "Blumenkohlpüree mit Hackfleischtopping",
    "instructions": [
        "Für das Püree den Blumenkohl putzen und in Salzwasser garen. Wenn die Röschen schön weich sind, diese stampfen. Die Crème fraiche mit einem Schneebesen unterrühren. Kräftig mit Muskat, Salz und Pfeffer abschmecken.",
        "Die Zwiebeln und den Porree putzen und zerkleinern. In einer beschichteten Pfanne das Hackfleisch ohne die Zugabe von Fett anbraten, Zwiebeln und Porree zugeben, mit Salz, Pfeffer und Paprika würzen und alles braten, bis das Gemüse gar und das Hackfleisch schön braun ist.",
        "Das Hackfleisch auf dem Blumenkohlpüree anrichten, alles mit frisch gehackter Petersilie bestreuen und servieren.",
        "Die Gewürze können natücrlich beliebig ergänzt werden. Koriander- oder Fenchelkörner im Hackfleisch sind z. B. tolle Varianten."
    ],
    "addedBy": "PUCyoKzyGnUibniIXo9b1uA4Jmk1",
    "addedTimestamp": serverTimestamp(),
    "sourceUrl": "https://www.chefkoch.de/rezepte/2627441412753172/Blumenkohlpueree-mit-Hackfleischtopping.html",
    "prepTime": "P0DT0H40M",
    "cookTime": "P0DT0H30M",
    "totalTime": "P0DT1H10M",
    "recipeYield": 3,
    "keywords": [
    ],
    "comments": [
    ]
}

const collectionRef = collection(db, "recipes");
const docRef = doc(collectionRef);
const id = docRef.id;
console.log(docRef, id);
setDoc(docRef, { id: id, ...recipe }).then(function () {
    console.log("Document written with ID: ", docRef.id);
})
    .catch(function (error) {
        console.error("Error adding document: ", error);
    });
/*addDoc(collection(db, "recipes"), recipe).then(function (docRef) {
    console.log("Document written with ID: ", docRef.id);
})
    .catch(function (error) {
        console.error("Error adding document: ", error);
    });*/