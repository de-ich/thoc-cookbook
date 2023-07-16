<script lang="ts">
	import { goto } from '$app/navigation';
	import type { RecipeDetails } from '$lib/database/Recipe';
	import IconButton from '@smui/icon-button';
	import Chip, { Set, Text as ChipText } from '@smui/chips';
	import { createError } from '../../../stores/errormessagestore';
	import { deleteRecipe } from '$lib/firebase/recipe';
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import IngredientsList from '../../../components/IngredientsList.svelte';
	import InstructionsList from '../../../components/InstructionsList.svelte';
	import ConfirmDeleteRecipeDialog from '../../../components/dialogs/ConfirmDeleteRecipeDialog.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: RecipeDetails = data.recipe;

	let showConfirmDeleteDialog = false;

	const deleteRecipeFromDatabase = () => {
		deleteRecipe(recipe.id)
			.then(() => goto('/recipes/'))
			.catch(createError);
	};
</script>

<div class="headingContainer">
	<h4>{recipe.name}</h4>
	<div class="headingButtons">
		<IconButton
			class="material-icons"
			aria-label="copy recipe URL to clipboard"
			on:click={() => navigator.clipboard.writeText(window.location.href)}
			>content_copy
		</IconButton>
		<IconButton
			class="material-icons"
			aria-label="open cooking view"
			on:click={() => goto(`/recipes/${recipe.id}/focus`)}
			>pageview
		</IconButton>
		<IconButton
			class="material-icons"
			aria-label="edit recipe"
			on:click={() => goto(`/recipes/${recipe.id}/edit`)}
			>edit
		</IconButton>
		<IconButton
			class="material-icons"
			aria-label="delete recipe"
			on:click={() => (showConfirmDeleteDialog = true)}
			>delete
		</IconButton>
	</div>
</div>

{#if (recipe.images || []).length > 0 && typeof recipe.images[0] === 'string'}
	<div class="imagesContainer">
		<img src={PUBLIC_IMAGEKIT_STORAGE_URL + 'tr:h-200/' + recipe.images[0]} alt="recipeImage" />
	</div>
{/if}

{#if (recipe.keywords || []).length > 0}
	<div class="keywordsContainer">
		<Set chips={recipe.keywords.filter((keyword) => keyword)} let:chip nonInteractive>
			<Chip {chip}>
				<ChipText>{chip}</ChipText>
			</Chip>
		</Set>
	</div>
{/if}

<div class="ingredientsAndInstructionsContainer">
	<div class="ingredientsContainer">
		<IngredientsList {recipe} />
	</div>

	<div class="instructionsAndCommentContainer">
		<div class="instructionsContainer">
			<InstructionsList {recipe} />
		</div>

		{#if recipe.comment}
			<div class="commentsContainer">
				<h6>Kommentar:</h6>
				<div class="commentContainer">
					{recipe.comment}
				</div>
			</div>
		{/if}
	</div>
</div>

<ConfirmDeleteRecipeDialog recipeName={recipe.name} bind:showConfirmDeleteDialog on:delete-recipe={deleteRecipeFromDatabase} />

<style lang="scss">
	.headingContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;

		h4 {
			margin-right: 1rem;
		}
	}

	img {
		height: 10rem;
		border-radius: 0.5rem;
	}

	.imagesContainer {
		margin-top: 1rem;
	}

	.ingredientsAndInstructionsContainer {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		column-gap: 2rem;
		margin-top: 2rem;

		@media (max-width: 800px) {
			flex-direction: column;
		}
	}

	.ingredientsContainer {
		width: 25rem;
		min-width: 25rem;
	}

	.instructionsContainer {
		flex-grow: 1;
		margin-bottom: 2rem;
		max-width: 35rem;
	}
</style>
