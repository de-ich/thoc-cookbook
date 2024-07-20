import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase.client';
import { httpsCallable } from '$lib/firebase/firebase.client';
import type { FieldValue } from 'firebase/firestore';

export interface History {
	entries: HistoryEntry[];
}

export interface HistoryEntry {
	timestamp: FieldValue;
	recipeId: string;
}

const aggregatesCollectionRef = collection(db, 'aggregates');

const pushToHistoryCallable = httpsCallable('pushToHistory');

export const addEntryToHistory = async (recipeId: string) => {
	pushToHistoryCallable({ recipeId: recipeId });
};

export const getHistoryRef = () => {
	return doc(aggregatesCollectionRef, 'history');
};

export const getHistory = async () => {
	const historyRef = getHistoryRef();
	return getDoc(historyRef).then((document) => document.data() as History);
};
