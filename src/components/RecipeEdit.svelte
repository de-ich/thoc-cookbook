<script lang="ts">
	import Textfield from '@smui/textfield';
	import { getEmptyRecipeDraft, type RecipeDraft } from '$lib/database/Recipe';
	import { parseIngredient } from '$lib/ingredient-parser';
	import { formatQuantity } from 'format-quantity';
	import SegmentedButton, { Segment } from '@smui/segmented-button';
	import { Label } from '@smui/common';
	import { RecipeYieldType } from '$lib/database/Recipe';
	import { onMount } from 'svelte';
	import KeywordSpecifier from './KeywordSpecifier.svelte';
	import { getAllKeywords } from '$lib/firebase/recipe';
	import KeywordChips from './KeywordChips.svelte';

	// either pass in an existing Recipe/RecipeDraft (when editing a recipe) or use an
	// empty draft (when creating a new recipe)
	export let recipeDraft: RecipeDraft = getEmptyRecipeDraft();

	let availableKeywords: string[] = [];

	getAllKeywords().then(keywords => availableKeywords = keywords);

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
	<Textfield
		id="recipeTitle"
		variant="outlined"
		type="text"
		bind:value={recipeDraft.name}
		label="Rezepttitel"
		required
	/>
	<div class="yieldAndTimesContainer">
		<div class="yieldContainer">
			<SegmentedButton
				segments={[RecipeYieldType.Serving, RecipeYieldType.BakingDish]}
				let:segment
				singleSelect
				bind:selected={recipeDraft.recipeYieldType}
			>
				<!-- Note: the `segment` property is required! -->
				<Segment {segment}>
					<Label>{segment}</Label>
				</Segment>
			</SegmentedButton>
			<Textfield
				variant="outlined"
				type="number"
				bind:value={recipeDraft.recipeYield}
				label={recipeDraft.recipeYieldType}
				style="max-width: 10rem;"
				suffix={recipeDraft.recipeYieldType === RecipeYieldType.BakingDish ? 'cm' : ''}
				input$emptyValueUndefined
			/>
		</div>
		<div class="recipeDraftTimesContainer">
			<Textfield
				variant="outlined"
				type="number"
				bind:value={recipeDraft.prepTime}
				label="Vorbereitungszeit"
				style="min-width: 6rem;max-width: 10rem;"
				suffix="min"
				input$emptyValueUndefined
			/>
			<Textfield
				variant="outlined"
				type="number"
				bind:value={recipeDraft.cookTime}
				label="Koch-/Backzeit"
				style="min-width: 6rem;max-width: 10rem;"
				suffix="min"
				input$emptyValueUndefined
			/>
			<Textfield
				variant="outlined"
				type="number"
				bind:value={recipeDraft.restingTime}
				label="Ruhezeit"
				style="min-width: 6rem;max-width: 10rem;"
				suffix="min"
				input$emptyValueUndefined
			/>
			<Textfield
				variant="outlined"
				type="number"
				bind:value={recipeDraft.totalTime}
				label="Gesamtzeit"
				style="min-width: 6rem;max-width: 10rem;"
				suffix="min"
				input$emptyValueUndefined
			/>
		</div>
	</div>
	<Textfield
		style="width: 100%;min-height: 10rem;"
		helperLine$style="width: 100%;"
		textarea
		label="Zutaten"
		required
		bind:value={ingredients}
	/>
	<Textfield
		style="width: 100%;min-height: 10rem;"
		helperLine$style="width: 100%;"
		textarea
		label="Zubereitung"
		required
		bind:value={instructions}
	/>
	<Textfield
		variant="outlined"
		type="text"
		style="width: 100%;"
		helperLine$style="width: 100%;"
		label="Rezeptbild (URL)"
		bind:value={recipeImageUrls}
		input$emptyValueUndefined
	/>
	<Textfield
		variant="outlined"
		type="file"
		label="Rezeptbild (Datei)"
		bind:files={recipeImageFiles}
		input$emptyValueUndefined
	/>
	<div class="keywordContainer">
		<KeywordSpecifier availableKeywords={availableKeywords} bind:selectedKeywords={recipeDraft.keywords} />
		<KeywordChips bind:selectedKeywords={recipeDraft.keywords} />
	</div>
	<Textfield
		style="width: 100%;"
		helperLine$style="width: 100%;"
		textarea
		label="Kommentar"
		bind:value={recipeDraft.comment}
		input$emptyValueUndefined
	/>
	<Textfield
		variant="outlined"
		type="text"
		style="width: 100%;"
		helperLine$style="width: 100%;"
		label="Quelle"
		bind:value={recipeDraft.sourceUrl}
		input$emptyValueUndefined
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
