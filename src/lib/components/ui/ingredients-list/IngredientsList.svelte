<script lang="ts">
	import { RecipeYieldType, type RecipeDetails } from '$lib/database/Recipe';
	import { IconButton } from '$lib/components/ui/icon-button';
	import type { Ingredient } from 'parse-ingredient';
	import { formatQuantity } from 'format-quantity';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Plus from 'lucide-svelte/icons/plus';
	import Minus from 'lucide-svelte/icons/minus';

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

	let showCustomQuantityDialog = false;

	const handleCustomQuantityButtonKeyUp = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			openCustomQuantityDialog();
		}
	};

	const openCustomQuantityDialog = () => {
		showCustomQuantityDialog = true;
	};

	$: newYield = currentYield;
</script>

<div class="flex flex-col">
	{#if recipe.recipeYield}
		<h5 class="mb-2">
			Zutaten für
			<IconButton on:click={decreaseYield}>
				<Minus class="h-3 w-3" />
			</IconButton>
			<Button variant="ghost" class="px-0.5" on:click={openCustomQuantityDialog}
				on:keyup={handleCustomQuantityButtonKeyUp}>{recipe.recipeYieldType === RecipeYieldType.BakingDish
					? getQuantityDisplayValue(currentYield) + 'er'
					: getQuantityDisplayValue(currentYield)}</Button>
			<IconButton on:click={increaseYield}>
				<Plus class="h-3 w-3" />
			</IconButton>
			{recipe.recipeYieldType === RecipeYieldType.BakingDish ? 'Backform' : 'Portionen'}
		</h5>
	{:else}
		<h5 class="mb-2">Zutaten</h5>
	{/if}

	{#each ingredientsForCurrentYield as ingredient, i}
		<div class="mb-2 flex flex-row items-center">
			{#if allowCheckItems}
				<Checkbox class="peer mr-3" />
			{/if}
			<span id={'ingredient-' + i} class="peer-aria-checked:text-muted-foreground">
				{getIngredientString(ingredient)}
			</span>
		</div>
	{/each}
</div>

<Dialog.Root bind:open={showCustomQuantityDialog}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Anzahl Portionen ändern</Dialog.Title>
		</Dialog.Header>
		<Input
			inputId="newYield"
			type="number"
			min="0"
			bind:value={newYield}
			label="Portionen"
			placeholder="Portionen"
			required
		/>
		<Dialog.Footer>
			<Button
				type="submit"
				on:click={() => {
					currentYield = newYield;
					showCustomQuantityDialog = false;
				}}
				disabled={Number.isNaN(newYield) || newYield <= 0}>OK</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
