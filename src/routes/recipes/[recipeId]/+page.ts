import { error } from '@sveltejs/kit';
import type { Recipe } from '$lib/database/Recipe';
import { db } from '$lib/firebase/firebase.client';
import { doc, getDoc } from 'firebase/firestore';
import { getRecipe } from '$lib/firebase/recipe';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    const recipeId = params['recipeId'];
    return getRecipe(recipeId).catch((error) => {
        throw error(404, error.message || 'Not found');
    });
}