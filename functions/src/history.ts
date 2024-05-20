import { onCall } from "firebase-functions/v2/https";
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const db = getFirestore();

interface History {
    entries: HistoryEntry[]
}

interface HistoryEntry {
    timestamp: Timestamp;
    recipeId: string;
}

export const pushToHistory = onCall({ maxInstances: 1 }, async (request) => {

    const recipeId = request.data.recipeId as string;

    const historyDocRef = db.doc(`aggregates/history`);

    historyDocRef.get().
        then(snapshot => snapshot.data() as History).
        then(history => {
            var newEntries = history.entries.filter(entry => entry.recipeId !== recipeId);
            newEntries.unshift({"recipeId": recipeId, "timestamp": Timestamp.now()});
            return newEntries.slice(0, 10);
        }).
        then(newEntries => {
            historyDocRef.set({entries: newEntries});
        });    
});