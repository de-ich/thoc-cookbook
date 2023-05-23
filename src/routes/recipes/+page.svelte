<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';
	import { db } from '$lib/firebase/firebase.client';
	import { collection, getDocs, query } from 'firebase/firestore';

	interface RecipeDictionary {
		[Key: number]: Recipe;
	}

	let recipes: RecipeDictionary = {};

	const recipesRef = collection(db, 'recipes');
	getDocs(query(recipesRef)).then((querySnapshot) => {
		recipes = Object.fromEntries(querySnapshot.docs.map((doc) => [doc.id, doc.data() as Recipe]));
	});
</script>

<h1>{Object.keys(recipes).length} Rezepte</h1>

<ul>
	{#each Object.entries(recipes) as recipeEntry}
		<li><a href="/recipes/{recipeEntry[0]}">{recipeEntry[1].name}</a></li>
	{/each}
</ul>
