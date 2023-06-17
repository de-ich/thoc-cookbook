<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Recipe } from '$lib/database/Recipe';
	import { RecipeYieldType } from '$lib/database/Recipe';
	import IconButton from '@smui/icon-button';
	import List, { Item, Text } from '@smui/list';
	import formatQuantity from 'format-quantity';
	import type { Ingredient } from 'parse-ingredient';
	import Chip, { Set, Text as ChipText } from '@smui/chips';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: Recipe = data.recipe;
	let currentYield = recipe.recipeYield || 1;

	const getIngredientString = (ingredient: Ingredient): string => {
		let ret =
			(ingredient.quantity != null ? getQuantityDisplayValue(ingredient.quantity) : '') +
			(ingredient.quantity2 != null ? '-' + getQuantityDisplayValue(ingredient.quantity2) : '');

		if (ingredient.unitOfMeasure) {
			ret += ingredient.unitOfMeasure;
		}

		if (ingredient.description) {
			ret += ' ' + ingredient.description;
		}

		return ret.trim();
	};

	const increaseYield = () => {
		if (currentYield < 1) {
			currentYield *= 2;
		} else {
			currentYield += 1;
		}
	};

	const decreaseYield = () => {
		if (currentYield <= 1) {
			currentYield /= 2;
		} else {
			currentYield -= 1;
		}
	};

	const DEFAULT_SERVINGS = 1;
	const DEFAULT_BAKING_DISH_SIZE = 26;

	const getScaledIngredientQuantity = (
		quantity: number | null,
		recipeYield: number | null,
		intendedYield: number,
		yieldType: RecipeYieldType
	) => {
		if (quantity == null) {
			return null;
		}

		if (yieldType === RecipeYieldType.BakingDish) {
			return (
				(quantity * Math.pow(intendedYield, 2)) /
				Math.pow(recipeYield || DEFAULT_BAKING_DISH_SIZE, 2)
			);
		} else {
			return (quantity / (recipeYield || DEFAULT_SERVINGS)) * intendedYield;
		}
	};

	const getIngredientWithUpdatedCounts = (
		ingredient: Ingredient,
		intendedYield: number,
		yieldType: RecipeYieldType = RecipeYieldType.Serving
	) => {
		return {
			...ingredient,
			quantity: getScaledIngredientQuantity(
				ingredient.quantity,
				recipe.recipeYield,
				intendedYield,
				yieldType
			),
			quantity2: getScaledIngredientQuantity(
				ingredient.quantity2,
				recipe.recipeYield,
				intendedYield,
				yieldType
			)
		};
	};

	$: ingredientsForCurrentYield = recipe.ingredients.map((ingredient) =>
		getIngredientWithUpdatedCounts(ingredient, currentYield, recipe.recipeYieldType)
	);

	const getQuantityDisplayValue = (quantity: number) => {
		let formattedQuantity = quantity > 1 ? quantity + '' : formatQuantity(quantity);

		if (formattedQuantity === null) {
			return null;
		}

		let parsedFormattedQuantity = parseFloat(formattedQuantity);
		if (parsedFormattedQuantity + '' !== formattedQuantity) {
			return formattedQuantity;
		} else if (parsedFormattedQuantity < 0.1) {
			return ('' + Math.round(parsedFormattedQuantity * 100) / 100).replace('.', ',');
		} else {
			return ('' + Math.round(parsedFormattedQuantity * 10) / 10).replace('.', ',');
		}
	};
</script>

<div class="headingContainer">
	<h4>{recipe.name}</h4>
	<IconButton
		class="material-icons"
		aria-label="Edit"
		on:click={() => goto(`/recipes/${recipe.id}/edit`)}
		>edit
	</IconButton>
</div>

{#if (recipe.images || []).length > 0 && typeof recipe.images[0] === 'string'}
	<div class="imagesContainer">
		<img src={recipe.images[0]} alt="recipeImage" />
	</div>
{/if}

<div class="keywordsContainer">
	{#if (recipe.keywords || []).length > 0}
	<Set chips={recipe.keywords.filter(keyword => keyword)} let:chip nonInteractive>
	  <Chip {chip}>
		<ChipText>{chip}</ChipText>
	  </Chip>
	</Set>
	{/if}
</div>

<div class="ingredientsAndInstructionsContainer">
	<div class="ingredientsContainer">
		{#if recipe.recipeYield}
			<h5>
				Zutaten für
				<IconButton class="material-icons" on:click={decreaseYield} size="button">remove</IconButton
				>
				{recipe.recipeYieldType === RecipeYieldType.BakingDish
					? getQuantityDisplayValue(currentYield) + 'er'
					: getQuantityDisplayValue(currentYield)}
				<IconButton class="material-icons" on:click={increaseYield} size="button">add</IconButton>
				{recipe.recipeYieldType === RecipeYieldType.BakingDish ? 'Backform' : 'Portionen'}
			</h5>
		{:else}
			<h5>Zutaten</h5>
		{/if}
		<List nonInteractive>
			{#each ingredientsForCurrentYield as ingredient}
				<Item>
					{getIngredientString(ingredient)}
				</Item>
			{/each}
		</List>
	</div>

	<div class="instructionsAndCommentContainer">
		<div class="instructionsContainer">
			<h5>Zubereitung:</h5>
			{#each recipe.instructions as instruction}
				<div class="instructionContainer">
					{instruction}
				</div>
			{/each}
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

<style lang="scss">
	.headingContainer {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	img {
		max-height: 10rem;
		border-radius: 0.5rem;
	}

	h5 {
		margin-top: 2rem;
		margin-bottom: 0.5rem;
		line-height: 2em;
	}

	.imagesContainer {
		margin-top: 1rem;
	}

	.ingredientsAndInstructionsContainer {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		column-gap: 2rem;
	}

	@media (max-width: 800px) {
		.ingredientsAndInstructionsContainer {
			flex-direction: column;
		}
	}

	.ingredientsContainer {
		width: 25rem;
		min-width: 25rem;

		:global(.mdc-deprecated-list-item) {
			height: 2em;
		}
	}

	.instructionsContainer {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 2rem;
		max-width: 35rem;
	}
</style>
