<div class="recipeList">
	{#each Object.entries(recipes) as recipeEntry}
		<RecipeCard recipe={recipeEntry[1]} recipeUrl={'/recipes/' + recipeEntry[0]} />
	{/each}
</div>