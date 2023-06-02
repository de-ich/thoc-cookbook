<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';
	import { db } from '$lib/firebase/firebase.client';
	import { collection, getDocs, query } from 'firebase/firestore';
	import RecipeCard from '../../components/RecipeCard.svelte';

	let recipes: Recipe[] = [];

	const recipesRef = collection(db, 'recipes');
	getDocs(query(recipesRef)).then((querySnapshot) => {
		recipes = querySnapshot.docs.map((doc) => doc.data() as Recipe);
	});	
</script>

<div class="recipeList">
	<h5>Alle Rezepte</h5>
	{#each recipes as recipe}
		<RecipeCard recipe={recipe} />
	{/each}
</div>

<style lang="scss">
	.recipeList {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
