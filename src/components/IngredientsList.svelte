<script lang="ts">
	import { RecipeYieldType, type RecipeDetails } from '$lib/database/Recipe';
	import IconButton from '@smui/icon-button';
	import type { Ingredient } from 'parse-ingredient';
	import formatQuantity from 'format-quantity';
	import List, { Item } from '@smui/list';
	import Checkbox from '@smui/checkbox';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import Textfield from '@smui/textfield';
	import Button, { Label } from '@smui/button';

	export let recipe: RecipeDetails;
	export let allowCheckItems = false;

	const DEFAULT_SERVINGS = 1;
	const DEFAULT_BAKING_DISH_SIZE = 26;

	let currentYield = recipe.recipeYield || 1;
	$: ingredientsForCurrentYield = recipe.ingredients.map((ingredient) =>
		getIngredientWithUpdatedCounts(ingredient, currentYield, recipe.recipeYieldType)
	);

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

	const handleSelection = (event: CustomEvent, i: number) => {
		const checked = (event.target as HTMLInputElement)?.checked;
		const ingredientItem = document.querySelector('#ingredient-' + i);

		if (!ingredientItem) {
			return;
		}

		if (checked) {
			ingredientItem.classList.add('disabled');
		} else {
			ingredientItem.classList.remove('disabled');
		}
	};

	let showCustomQuantityDialog = false;

	const handleCustomQuantityButtonKeyUp = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			openCustomQuantityDialog();
		}
	}

	const openCustomQuantityDialog = () => {
		showCustomQuantityDialog = true
	}

	$: newYield = currentYield;
</script>

<div class="ingredientsList">
	{#if recipe.recipeYield}
		<h5>
			Zutaten für
			<IconButton class="material-icons" on:click={decreaseYield} size="button">remove</IconButton>
			<span class="customQuantityButton" aria-label="Custom Quantity" role="button" tabindex="0" on:click={openCustomQuantityDialog} on:keyup={handleCustomQuantityButtonKeyUp}>{recipe.recipeYieldType === RecipeYieldType.BakingDish
				? getQuantityDisplayValue(currentYield) + 'er'
				: getQuantityDisplayValue(currentYield)}</span>
			<IconButton class="material-icons" on:click={increaseYield} size="button">add</IconButton>
			{recipe.recipeYieldType === RecipeYieldType.BakingDish ? 'Backform' : 'Portionen'}
		</h5>
	{:else}
		<h5>Zutaten</h5>
	{/if}
	
	{#each ingredientsForCurrentYield as ingredient, i}
	<div class="ingredientContainer">
		{#if allowCheckItems}
			<Checkbox on:click={(event) => handleSelection(event, i)} />
		{/if}
		<span id={'ingredient-' + i}>
			{getIngredientString(ingredient)}
		</span>
	</div>
	{/each}
</div>

<Dialog bind:open={showCustomQuantityDialog} aria-label="Anzahl Portionen" aria-describedby="simple-content">
	<Content id="simple-content">
		<Textfield type="number" bind:value={newYield} label="Portionen" />
	</Content>
	<Actions>
		<Button>
			<Label>Abbrechen</Label>
		</Button>
		<Button on:click={() => currentYield = newYield} disabled={newYield === 0}>
			<Label>OK</Label>
		</Button>
	</Actions>
</Dialog>


<style lang="scss">
	.ingredientsList {
		display: flex;
		flex-direction: column;

		:global(.disabled) {
			color: var(--mdc-theme-text-secondary-on-background);
		}
	}

	h5 {
		margin-bottom: 0.5rem;
	}

	.ingredientContainer {
		margin-bottom: 0.5rem;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.customQuantityButton {
		cursor: pointer;
	}
</style>
