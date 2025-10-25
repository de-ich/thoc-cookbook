<script lang="ts">
	import { RecipeYieldType, type RecipeDetails } from '$lib/database/Recipe';
	import { IconButton } from '$lib/components/icon-button';
	import type { Ingredient } from 'parse-ingredient';
	import { formatQuantity } from 'format-quantity';
	import { Checkbox } from '$lib/shadcn/checkbox';
	import * as Dialog from '$lib/shadcn/dialog/index.js';
	import { Button } from '$lib/shadcn/button';
	import { Input } from '$lib/shadcn/input';
	import Plus from 'lucide-svelte/icons/plus';
	import Minus from 'lucide-svelte/icons/minus';

	export type Props = {
		recipe: RecipeDetails;
		allowCheckItems?: boolean;
		initialYield?: number;
		yieldChangedCallback?: (newYield: number) => any;
	};
	
	let { recipe, allowCheckItems = false, initialYield, yieldChangedCallback }: Props = $props();

	const DEFAULT_SERVINGS = 1;
	const DEFAULT_BAKING_DISH_SIZE = 26;

	const initialYieldNumber = Number.parseFloat(
		(initialYield ?? recipe.recipeYield ?? DEFAULT_SERVINGS) as unknown as string
	);

	let currentYield = $state(initialYieldNumber);
	let newYield = $state(initialYieldNumber);

	const updateYield = (newYieldValue: number) => {
		currentYield = newYieldValue;
		yieldChangedCallback?.(currentYield);
	};

	const increaseYield = () => {
		updateYield(currentYield < 1 ? currentYield *= 2:currentYield += 1);
	};

	const decreaseYield = () => {
		updateYield(currentYield <= 1 ? currentYield /= 2 : currentYield -= 1);
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

	let showCustomQuantityDialog = $state(false);

	const handleCustomQuantityButtonKeyUp = (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			openCustomQuantityDialog();
		}
	};

	const openCustomQuantityDialog = () => {
		showCustomQuantityDialog = true;
	};

	let ingredientsForCurrentYield = $derived(
		recipe.ingredients.map((ingredient) =>
			getIngredientWithUpdatedCounts(ingredient, currentYield, recipe.recipeYieldType)
		)
	);
</script>

<div class="flex flex-col">
	{#if recipe.recipeYield}
		<h5 class="mb-4 flex h-5 max-h-5 items-center overflow-y-hidden">
			<span class="text-nowrap">Zutaten für</span>
			<IconButton onclick={decreaseYield}>
				<Minus class="h-3 w-3" />
			</IconButton>
			<Button
				variant="ghost"
				class="text-md px-0.5"
				onclick={openCustomQuantityDialog}
				onkeyup={handleCustomQuantityButtonKeyUp}
				>{recipe.recipeYieldType === RecipeYieldType.BakingDish
					? getQuantityDisplayValue(currentYield) + 'er'
					: getQuantityDisplayValue(currentYield)}</Button
			>
			<IconButton onclick={increaseYield}>
				<Plus class="h-3 w-3" />
			</IconButton>
			{recipe.recipeYieldType === RecipeYieldType.BakingDish ? 'Backform' : 'Portionen'}:
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
				onclick={() => {
					updateYield(newYield);
					showCustomQuantityDialog = false;
				}}
				disabled={Number.isNaN(newYield) || newYield <= 0}>OK</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
