<script lang="ts">
	import { goto } from '$app/navigation';
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { IconButton } from '$lib/components/ui/icon-button';
	import Copy from 'lucide-svelte/icons/copy';
	import ChefHat from 'lucide-svelte/icons/chef-hat';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Clock from 'lucide-svelte/icons/clock';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import Chip, { Set, Text as ChipText } from '@smui/chips';
	import { createError } from '../../../stores/errormessagestore';
	import { deleteRecipe } from '$lib/firebase/recipe';
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import IngredientsList from '../../../lib/components/ui/ingredients-list/IngredientsList.svelte';
	import InstructionsList from '../../../components/InstructionsList.svelte';
	import ConfirmDeleteRecipeDialog from '../../../components/dialogs/ConfirmDeleteRecipeDialog.svelte';
	import { addEntryToHistory } from '$lib/firebase/history';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: RecipeDetails = data.recipe;

	let showConfirmDeleteDialog = false;

	const deleteRecipeFromDatabase = () => {
		deleteRecipe(recipe.id)
			.then(() => goto('/recipes/'))
			.catch(createError);
	};

	addEntryToHistory(recipe.id);
</script>

<div class="headingContainer">
	<h4>{recipe.name}</h4>
	<div class="headingButtons">
		<IconButton on:click={() => navigator.clipboard.writeText(window.location.href)} >
			<Copy class="w-4 h-4" />
		</IconButton>
		<IconButton on:click={() => goto(`/recipes/${recipe.id}/focus`)}>
			<ChefHat class="w-4 h-4" />
		</IconButton>
		<IconButton on:click={() => goto(`/recipes/${recipe.id}/edit`)}>
			<Pencil class="w-4 h-4" />
		</IconButton>
		<IconButton on:click={() => (showConfirmDeleteDialog = true)}>
			<Trash2 class="w-4 h-4" />
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

{#if recipe.prepTime || recipe.cookTime || recipe.restingTime || recipe.totalTime}
	<div class="recipeTimesContainer">
		{#if recipe.prepTime}
			<div class="recipeTimeContainer">
				<Clock class="w-4 h-4" />
				<span>Vorbereitungszeit:</span>
				<span>{recipe.prepTime}min</span>
			</div>
		{/if}
		{#if recipe.cookTime}
			<div class="recipeTimeContainer">
				<Clock class="w-4 h-4" />
				<span>Koch-/Backzeit:</span>
				<span>{recipe.cookTime}min</span>
			</div>
		{/if}
		{#if recipe.restingTime}
			<div class="recipeTimeContainer">
				<Clock class="w-4 h-4" />
				<span>Ruhezeit:</span>
				<span>{recipe.restingTime}min</span>
			</div>
		{/if}
		{#if recipe.totalTime}
			<div class="recipeTimeContainer">
				<Clock class="w-4 h-4" />
				<span>Gesamtzeit:</span>
				<span>{recipe.totalTime}min</span>
			</div>
		{/if}
	</div>
{/if}

{#if recipe.sourceUrl}
	<div class="sourceContainer">
		<ExternalLink class="w-4 h-4" />
		<span>Quelle:</span>
		<a href={recipe.sourceUrl}>{recipe.sourceUrl}</a>
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

<ConfirmDeleteRecipeDialog
	recipeName={recipe.name}
	bind:showConfirmDeleteDialog
	on:delete-recipe={deleteRecipeFromDatabase}
/>

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

	.recipeTimesContainer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		column-gap: 2rem;
		row-gap: 0.3rem;
		margin-top: 2rem;
	}

	.recipeTimeContainer {
		display: flex;
		flex-direction: row;
		justify-items: center;
		column-gap: 0.5rem;

		span:first-of-type {
			font-weight: 500;
		}
	}

	.sourceContainer {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow: hidden;
		justify-items: center;
		column-gap: 0.5rem;
		margin-top: 2rem;

		span:first-of-type {
			font-weight: 500;
		}

		a {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;

			&:hover {
				color: var(--mdc-theme-primary);
			}
		}
	}

	.ingredientsAndInstructionsContainer {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		column-gap: 2rem;
		row-gap: 2rem;
		margin-top: 2rem;

		@media (max-width: 800px) {
			flex-direction: column;
		}
	}

	.ingredientsContainer {
		max-width: 25rem;
	}

	.instructionsContainer {
		flex-grow: 1;
		margin-bottom: 2rem;
		max-width: 35rem;
	}
</style>
