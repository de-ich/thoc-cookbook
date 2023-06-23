import { writable } from 'svelte/store';

export const errorMessageStore = writable<string | null>(null);

export const confirmError = () => {
    errorMessageStore.set(null);
}

export const createError = (error: Error | string) => {
    const errorMessage = typeof (error) === 'string' ? error : (error.message || 'Internal Error!');
    errorMessageStore.set(errorMessage);
}
