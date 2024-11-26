<script lang="ts">
	import { getEmptyRecipeDraft, type RecipeDraft } from '$lib/database/Recipe';
	import { parseIngredient } from '$lib/ingredient-parser';
	import { formatQuantity } from 'format-quantity';
	import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
	import { RecipeYieldType } from '$lib/database/Recipe';
	import { onMount } from 'svelte';
	import KeywordSpecifier from './KeywordSpecifier.svelte';
	import { getAllKeywords } from '$lib/firebase/recipe';
	import KeywordChips from './KeywordChips.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Textarea } from '$lib/components/ui/textarea';

	// either pass in an existing Recipe/RecipeDraft (when editing a recipe) or use an
	// empty draft (when creating a new recipe)
	export let recipeDraft: RecipeDraft = getEmptyRecipeDraft();

	let availableKeywords: string[] = [];

	getAllKeywords().then((keywords) => (availableKeywords = keywords));

	onMount(() => {
		// make sure all fields are properly initialized
		recipeDraft = { ...getEmptyRecipeDraft(), ...recipeDraft };
	});

	let instructions = recipeDraft.instructions.join('\n');
	$: {
		recipeDraft.instructions = instructions.split('\n').map((instruction) => instruction.trim());
	}

	let ingredients = recipeDraft.ingredients
		.map((ingredient) => {
			let ret =
				(ingredient.quantity != null ? formatQuantity(ingredient.quantity) : '') +
				(ingredient.quantity2 != null ? '-' + formatQuantity(ingredient.quantity2) : '');

			if (ingredient.unitOfMeasure) {
				ret += ingredient.unitOfMeasure;
			}

			if (ingredient.description) {
				ret += ' ' + ingredient.description;
			}

			return ret.trim();
		})
		.filter((ingredient) => ingredient !== '')
		.join('\n');

	$: {
		recipeDraft.ingredients = parseIngredient(ingredients);
	}

	let recipeImageUrls = recipeDraft.images.filter((image) => typeof image === 'string').join('\n');
	$: {
		const existingImageFiles = recipeDraft.images.filter((image) => typeof image !== 'string');
		const newImages: (string | File)[] = [];
		newImages.push(...existingImageFiles);
		if ((recipeImageUrls || []).length > 0) {
			newImages.push(...recipeImageUrls.split('\n').map((imageUrl) => imageUrl.trim()));
		}
		recipeDraft.images = newImages;
	}

	let recipeImageFiles: FileList;
	$: {
		const existingImageUrl = recipeDraft.images.filter((image) => typeof image === 'string');
		const newImages: (string | File)[] = [];
		newImages.push(...existingImageUrl);
		if (recipeImageFiles) {
			for (let file of recipeImageFiles) {
				newImages.push(file);
			}
		}
		recipeDraft.images = newImages;
	}
</script>

<div class="recipeDraftContainer">
	<Input
		inputId="recipeTitle"
		label="Rezepttitel"
		placeholder="Rezepttitel"
		required
		bind:value={recipeDraft.name}
	/>
	<div class="yieldAndTimesContainer">
		<div class="yieldContainer">
			<ToggleGroup.Root type="single" variant="outline" bind:value={recipeDraft.recipeYieldType} class="flex-col items-stretch">
				<ToggleGroup.Item value={RecipeYieldType.Serving}>Portionen</ToggleGroup.Item>
				<ToggleGroup.Item value={RecipeYieldType.BakingDish}>Backform</ToggleGroup.Item>
			</ToggleGroup.Root>
			<Input
				inputId="recipeYield"
				type="number"
				bind:value={recipeDraft.recipeYield}
				label={recipeDraft.recipeYieldType}
				suffix={recipeDraft.recipeYieldType === RecipeYieldType.BakingDish ? 'cm' : ''}
				class="max-w-40"
			/>
		</div>
		<div class="recipeDraftTimesContainer">
			<Input
				inputId="recipePrepTime"
				type="number"
				bind:value={recipeDraft.prepTime}
				label="Vorbereitungszeit"
				suffix="min"
				class="max-w-40"
			/>
			<Input
				inputId="recipeCookTime"
				type="number"
				bind:value={recipeDraft.cookTime}
				label="Koch-/Backzeit"
				suffix="min"
				class="max-w-40"
			/>
			<Input
				inputId="recipeRestingTime"
				type="number"
				bind:value={recipeDraft.restingTime}
				label="Ruhezeit"
				suffix="min"
				class="max-w-40"
			/>
			<Input
				inputId="recipeTotalTime"
				type="number"
				bind:value={recipeDraft.totalTime}
				label="Gesamtzeit"
				suffix="min"
				class="max-w-40"
			/>
		</div>
	</div>
	<Textarea
		inputId="recipeIngredients"
		required
		label="Zutaten"
		bind:value={ingredients}
		class="min-h-60 h-60"
	/>
	<Textarea
		inputId="recipeInstructions"
		required
		label="Zubereitung"
		bind:value={instructions}
		class="min-h-60 h-60"
	/>
	<Input
		inputId="recipeUrl"
		type="url"
		bind:value={recipeImageUrls}
		label="Rezeptbild (URL)"
		placeholder="Rezeptbild (URL)"
	/>
	<Input
		inputId="recipeFile"
		type="file"
		bind:files={recipeImageFiles}
		label="Rezeptbild (Datei)"
		placeholder="Rezeptbild (Datei)"
	/>
	<div class="keywordContainer">
		<KeywordSpecifier {availableKeywords} bind:selectedKeywords={recipeDraft.keywords} />
		<KeywordChips bind:selectedKeywords={recipeDraft.keywords} />
	</div>
	<Textarea
		inputId="recipeComment"
		label="Kommentar"
		bind:value={recipeDraft.comment}
	/>
	<Input
		inputId="recipeSourceUrl"
		type="url"
		bind:value={recipeDraft.sourceUrl}
		label="Quelle"
		placeholder="Quelle"
	/>
</div>

<style lang="scss">
	.recipeDraftContainer {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;

		.yieldAndTimesContainer {
			display: flex;
			flex-direction: row;
			gap: 2rem;
			align-items: center;

			@media (max-width: 1024px) {
				flex-direction: column;
			}

			.yieldContainer {
				display: flex;
				flex-direction: row;
				gap: 0.5rem;
				align-items: center;
			}

			.recipeDraftTimesContainer {
				display: flex;
				flex-direction: row;
				gap: 1rem;
				flex-wrap: wrap;
				justify-content: center;

				@media (min-width: 1025px) {
					margin-left: auto;
				}
			}
		}

		.keywordContainer {
			display: flex;
			flex-direction: row;

			@media (max-width: 1024px) {
				flex-direction: column;
			}
		}

		:global(input[type='file']::file-selector-button) {
			display: none;
		}

		:global(:not(.mdc-text-field--label-floating) input[type='file']) {
			color: transparent;
		}
	}
</style>
