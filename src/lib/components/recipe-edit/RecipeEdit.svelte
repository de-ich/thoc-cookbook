<script lang="ts">
	import { getEmptyRecipeDraft, type RecipeDraft } from '$lib/database/Recipe';
	import { parseIngredient } from '$lib/ingredient-parser';
	import { formatQuantity } from 'format-quantity';
	import * as ToggleGroup from '$lib/shadcn/toggle-group/index.js';
	import { RecipeYieldType } from '$lib/database/Recipe';
	import { onMount } from 'svelte';
	import KeywordSpecifier from '$lib/components/keyword-specifier';
	import { getAllKeywords } from '$lib/firebase/recipe';
	import KeywordChips from '$lib/components/keyword-chips';
	import Input from '$lib/shadcn/input/input.svelte';
	import { Textarea } from '$lib/shadcn/textarea';

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

<div class="flex flex-col gap-6">
	<Input
		inputId="recipeTitle"
		label="Rezepttitel"
		placeholder="Rezepttitel"
		required
		bind:value={recipeDraft.name}
	/>
	<div class="flex flex-col items-center gap-8 lg:flex-row">
		<div class="flex flex-row items-center gap-2">
			<ToggleGroup.Root
				type="single"
				variant="outline"
				bind:value={recipeDraft.recipeYieldType}
				class="flex-col items-stretch"
			>
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
		<div class="flex flex-row flex-wrap justify-center gap-4 lg:ml-auto">
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
		class="h-60 min-h-60"
	/>
	<Textarea
		inputId="recipeInstructions"
		required
		label="Zubereitung"
		bind:value={instructions}
		class="h-60 min-h-60"
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
	<div class="flex flex-col lg:flex-row">
		<KeywordSpecifier
			label="Label hinzufügen..."
			{availableKeywords}
			bind:selectedKeywords={recipeDraft.keywords}
		/>
		<KeywordChips class="lg:ml-4" bind:selectedKeywords={recipeDraft.keywords} />
	</div>
	<Textarea inputId="recipeComment" label="Kommentar" bind:value={recipeDraft.comment} />
	<Input
		inputId="recipeSourceUrl"
		type="url"
		bind:value={recipeDraft.sourceUrl}
		label="Quelle"
		placeholder="Quelle"
	/>
</div>
