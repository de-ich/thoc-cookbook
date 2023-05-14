import { writable } from 'svelte/store';
import { auth } from '../lib/firebase/firebase.client';
import { signOut, signInWithEmailAndPassword, type User } from 'firebase/auth';
import type { Nullable } from 'vitest';

export interface AuthStore {
    isLoading: boolean,
    currentUser: Nullable<User>
}

export const authStore = writable<AuthStore>();

export const authHandlers = {
    logout: async () => {
        await signOut(auth)
    },
    login: async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    }
}