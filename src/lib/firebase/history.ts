import { collection } from 'firebase/firestore';
import { db } from './firebase.client';
import { httpsCallable } from '$lib/firebase/firebase.client';

const aggregatesCollectionRef = collection(db, 'aggregates');

const pushToHistoryCallable = httpsCallable('pushToHistory');

export const addEntryToHistory = async (recipeId: string) => {
	pushToHistoryCallable({ recipeId: recipeId });
};
