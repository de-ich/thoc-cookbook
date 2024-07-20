import { onCall } from 'firebase-functions/v2/https';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

const db = getFirestore();

interface History {
	entries: HistoryEntry[];
}

interface HistoryEntry {
	timestamp: Timestamp;
	recipeId: string;
}

export const pushToHistory = onCall({ maxInstances: 1 }, async (request) => {
	const recipeId = request.data.recipeId as string;

	const historyDocRef = db.doc(`aggregates/history`);

	let history: History = {
		entries: []
	};

	try {
		history = await historyDocRef.get().then((snapshot) => snapshot.data() as History);
		if (typeof history.entries !== 'object') {
			history.entries = [];
		}
	} catch (e) {
		console.error(
			"Unable to convert document 'aggregates/history' to an instance of History. " +
				'The following error occurred: ' +
				e
		);
	}

	var newEntries = history.entries.filter((entry) => entry.recipeId !== recipeId);
	newEntries.unshift({ recipeId: recipeId, timestamp: Timestamp.now() });
	history.entries = [...newEntries];

	await historyDocRef.set(history);
});
