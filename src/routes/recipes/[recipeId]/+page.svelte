<script lang="ts">
	import { goto } from '$app/navigation';
	import type { RecipeDetails } from '$lib/database/Recipe';
	import IconButton, { Icon } from '@smui/icon-button';
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

{#if recipe.prepTime || recipe.cookTime || recipe.restingTime || recipe.totalTime}
	<div class="recipeTimesContainer">
		{#if recipe.prepTime}
			<div class="recipeTimeContainer">
				<Icon class="material-icons">schedule</Icon>
				<span>Vorbereitungszeit:</span>
				<span>{recipe.prepTime}min</span>
			</div>
		{/if}
		{#if recipe.cookTime}
			<div class="recipeTimeContainer">
				<Icon class="material-icons">schedule</Icon>
				<span>Koch-/Backzeit:</span>
				<span>{recipe.cookTime}min</span>
			</div>
		{/if}
		{#if recipe.restingTime}
			<div class="recipeTimeContainer">
				<Icon class="material-icons">schedule</Icon>
				<span>Ruhezeit:</span>
				<span>{recipe.restingTime}min</span>
			</div>
		{/if}
		{#if recipe.totalTime}
			<div class="recipeTimeContainer">
				<Icon class="material-icons">schedule</Icon>
				<span>Gesamtzeit:</span>
				<span>{recipe.totalTime}min</span>
			</div>
		{/if}
	</div>
{/if}

{#if (recipe.sourceUrl) }
<div class="sourceContainer">
	<Icon class="material-icons">launch</Icon>
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
		row-gap: .3rem;
		margin-top: 2rem;
	}

	.recipeTimeContainer {
		display: flex;
		flex-direction: row;
		justify-items: center;
		column-gap: .5rem;

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
		column-gap: .5rem;
		margin-top: 2rem;

		span:first-of-type {
			font-weight: 500;
		}

		a {
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			
			&:hover	{
				color: var(--mdc-theme-primary)
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
