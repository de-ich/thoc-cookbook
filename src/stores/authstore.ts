import { writable } from 'svelte/store';
import { auth } from '../lib/firebase/firebase.client';
import { signOut, signInWithEmailAndPassword, type User, type UserCredential } from 'firebase/auth';
import type { Nullable } from 'vitest';
import { createError } from './errormessagestore';

export interface AuthStore {
    isLoading: boolean,
    currentUser: Nullable<User>
}

export const authStore = writable<AuthStore>();

export const authHandlers = {
    logout: async (): Promise<null | Error> => {
        return await signOut(auth).catch(err => {
            return err;
        });
    },
    login: async (email: string, password: string): Promise<null | Error> => {
        return await signInWithEmailAndPassword(auth, email, password).catch(err => {
            return err;
        });
    }
}