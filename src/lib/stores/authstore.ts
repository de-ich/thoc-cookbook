import { writable } from 'svelte/store';
import { auth } from '../firebase/firebase.client';
import { signOut, signInWithEmailAndPassword, type User } from 'firebase/auth';

export interface AuthStore {
	isLoading: boolean;
	currentUser: User | null;
}

export const authStore = writable<AuthStore>();

export const authHandlers = {
	logout: async (): Promise<null | Error> => {
		return await signOut(auth).catch((err) => {
			return err;
		});
	},
	login: async (email: string, password: string): Promise<null | Error> => {
		return await signInWithEmailAndPassword(auth, email, password).catch((err) => {
			return err;
		});
	}
};
