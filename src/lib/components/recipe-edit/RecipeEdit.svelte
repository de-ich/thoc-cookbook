<script lang="ts">
	import { getEmptyRecipeDraft, type RecipeDetails, type RecipeDraft } from '$lib/database/Recipe';
	import { parseIngredient } from '$lib/ingredient-parser';
	import { formatQuantity } from 'format-quantity';
	import * as ToggleGroup from '$lib/shadcn/toggle-group/index.js';
	import { RecipeYieldType } from '$lib/database/Recipe';
	import KeywordSpecifier from '$lib/components/keyword-specifier';
	import { getAllKeywords } from '$lib/firebase/recipe';
	import KeywordChips from '$lib/components/keyword-chips';
	import Input from '$lib/shadcn/input/input.svelte';
	import { Textarea } from '$lib/shadcn/textarea';
	import type { Ingredient } from 'parse-ingredient';

	export type Props = {
		// either pass in an existing Recipe/RecipeDraft (when editing a recipe) or pass in
		// nothing (when creating a new recipe)
		recipeDraft?: RecipeDraft;
		recipeDraftModifiedCallback: (recipeDraft: RecipeDraft) => void;
	};

	let { recipeDraft = getEmptyRecipeDraft(), recipeDraftModifiedCallback: recipeDraftModified }: Props = $props();

	const serializeIngredients = (ingredients: Ingredient[]): string => {
		return ingredients
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
	};

	const parseImages = (recipeImageUrls: string, recipeImageFiles: File[]) => {
		const recipeImageUrlArray = (recipeImageUrls ?? []).split('\n').map((imageUrl) => imageUrl.trim()).filter((imageUrl) => imageUrl !== '');
		
		return [
			...recipeImageUrlArray,
			...recipeImageFiles
		];
	}

	let name= $state(recipeDraft?.name ?? '');
	let sourceUrl = $state(recipeDraft?.sourceUrl ?? null);
	let sourceId = $state(recipeDraft?.sourceId ?? null);
	let prepTime = $state(recipeDraft?.prepTime ?? null);
	let cookTime = $state(recipeDraft?.cookTime ?? null);
	let restingTime = $state(recipeDraft?.restingTime ?? null);
	let totalTime = $state(recipeDraft?.totalTime ?? null);
	let recipeYield = $state(recipeDraft?.recipeYield ?? null);
	let recipeYieldType = $state(recipeDraft?.recipeYieldType ?? RecipeYieldType.Serving);
	let keywords = $state([...(recipeDraft?.keywords ?? [])]);
	let comment = $state(recipeDraft?.comment ?? null);
	let recipeImageUrls = $state(recipeDraft?.images.filter((image) => typeof image === 'string').join('\n') ?? '');
	let recipeImageFiles: FileList | undefined = $state(undefined);
	let images = $derived.by(() => parseImages(recipeImageUrls, Array.from(recipeImageFiles ?? [])));
	let ingredientsString = $state(serializeIngredients(recipeDraft?.ingredients ?? [])); 
	let ingredients = $derived.by(() => parseIngredient(ingredientsString));
	let instructionsString = $state(recipeDraft?.instructions?.join('\n') ?? '');
	let instructions = $derived.by(() => instructionsString.split('\n').map((instruction) => instruction.trim()));

	let modifiedRecipeDraft: RecipeDraft = $derived({
        images: images,
        ingredients: ingredients,
        name: name,
        instructions: instructions,
        sourceUrl: sourceUrl,
        sourceId: sourceId,
        prepTime: prepTime,
        cookTime: cookTime,
        restingTime: restingTime,
        totalTime: totalTime,
        recipeYield: recipeYield,
        recipeYieldType: recipeYieldType,
        keywords: keywords,
        comment: comment
    });

	let availableKeywords: string[] = $state([]);

	getAllKeywords().then((keywords) => (availableKeywords = keywords));

	$effect(() => {
		recipeDraftModified(modifiedRecipeDraft);
	});
</script>

<div class="flex flex-col gap-6">
	<Input
		inputId="recipeTitle"
		label="Rezepttitel"
		placeholder="Rezepttitel"
		required
		bind:value={name}
	/>
	<div class="flex flex-col items-center gap-8 lg:flex-row">
		<div class="flex flex-row items-center gap-2">
			<ToggleGroup.Root
				type="single"
				variant="outline"
				bind:value={recipeYieldType}
				class="flex-col items-stretch"
			>
				<ToggleGroup.Item value={RecipeYieldType.Serving}>Portionen</ToggleGroup.Item>
				<ToggleGroup.Item value={RecipeYieldType.BakingDish}>Backform</ToggleGroup.Item>
			</ToggleGroup.Root>
			<Input
				inputId="recipeYield"
				type="number"
				bind:value={recipeYield}
				label={recipeYieldType}
				suffix={recipeYieldType === RecipeYieldType.BakingDish ? 'cm' : ''}
				class="max-w-40"
			/>
		</div>
		<div class="flex flex-row flex-wrap justify-center gap-4 lg:ml-auto">
			<Input
				inputId="recipePrepTime"
				type="number"
				bind:value={prepTime}
				label="Vorbereitungszeit"
				suffix="min"
				class="max-w-40"
			/>
			<Input
				inputId="recipeCookTime"
				type="number"
				bind:value={cookTime}
				label="Koch-/Backzeit"
				suffix="min"
				class="max-w-40"
			/>
			<Input
				inputId="recipeRestingTime"
				type="number"
				bind:value={restingTime}
				label="Ruhezeit"
				suffix="min"
				class="max-w-40"
			/>
			<Input
				inputId="recipeTotalTime"
				type="number"
				bind:value={totalTime}
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
		bind:value={ingredientsString}
		class="h-60 min-h-60"
	/>
	<Textarea
		inputId="recipeInstructions"
		required
		label="Zubereitung"
		bind:value={instructionsString}
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
			bind:selectedKeywords={keywords}
		/>
		<KeywordChips class="lg:ml-4" bind:selectedKeywords={keywords} />
	</div>
	<Textarea inputId="recipeComment" label="Kommentar" bind:value={comment} />
	<Input
		inputId="recipeSourceUrl"
		type="url"
		bind:value={sourceUrl}
		label="Quelle"
		placeholder="Quelle"
	/>
</div>
