<script lang="ts">
	import {
		recipePreviewStore,
		clearRecipePreview,
		transformedRecipePreviewStore
	} from '../../stores/recipepreviewstore';
	import { onDestroy } from 'svelte';
	import Textfield from '@smui/textfield';
	import type { RecipePreview } from '$lib/database/Recipe';
	import { parseIngredient } from '$lib/ingredient-parser';
	import Button from '@smui/button';
	import { addRecipe } from '$lib/firebase/addrecipe';
	import { goto } from '$app/navigation';

	let recipePreview: RecipePreview;
	const unsubcribe = recipePreviewStore.subscribe((value) => {
		recipePreview = value;
		console.log(value);
	});

	onDestroy(() => {
		unsubcribe();
		clearRecipePreview();
	});

	let instructions = transformedRecipePreviewStore(
		(value: RecipePreview) => value.instructions.join('\n'),
		(value: string) => {
			return {
				...recipePreview,
				instructions: value.split('\n').map((instruction) => instruction.trim())
			};
		}
	);

	let ingredients = transformedRecipePreviewStore(
		(value: RecipePreview) =>
			value.ingredients
				.map((ingredient) => {
					let ret =
						(ingredient.quantity || '') + (ingredient.quantity2 ? '-' + ingredient.quantity2 : '');

					if (ingredient.unitOfMeasure) {
						ret += ingredient.unitOfMeasure;
					}

					if (ingredient.description) {
						ret += ' ' + ingredient.description;
					}

					return ret.trim();
				})
				.filter((ingredient) => ingredient !== '')
				.join('\n'),
		(value: string) => {
			return {
				...recipePreview,
				ingredients: parseIngredient(value)
			};
		}
	);
	let keywords = transformedRecipePreviewStore(
		(value: RecipePreview) => value.keywords.join(', '),
		(value: string) => {
			return { ...recipePreview, keywords: value.split(',').map((keyword) => keyword.trim()) };
		}
	);
	let recipeImageUrls = transformedRecipePreviewStore(
		(value: RecipePreview) => value.images.filter((image) => typeof image === 'string').join('\n'),
		(value: string) => {
			const existingImageFiles = recipePreview.images.filter((image) => typeof image !== 'string');
			const newImages: (string | File)[] = [];
			newImages.push(...existingImageFiles);
			newImages.push(...value.split('\n').map((imageUrl) => imageUrl.trim()));
			return { ...recipePreview, images: newImages };
		}
	);
	let recipeImageFiles = transformedRecipePreviewStore(
		(value: RecipePreview) => value.images.filter((image) => typeof image !== 'string'),
		(value: File[]) => {
			const existingImageUrl = recipePreview.images.filter((image) => typeof image === 'string');
			const newImages: (string | File)[] = [];
			newImages.push(...existingImageUrl);
			newImages.push(...value);
			return { ...recipePreview, images: newImages };
		}
	);

	const addRecipeToDatabase = () => {
		addRecipe(recipePreview)
			.then((newRecipeId) => goto('/recipes/' + newRecipeId))
			.catch((error: any) => console.log(error));
	};
</script>

<div class="recipePreviewContainer">
	<Textfield
		variant="outlined"
		type="text"
		bind:value={$recipePreviewStore.name}
		label="Rezepttitel"
		style="min-width: 25rem;"
		required
	/>
	<div class="recipePreviewTimesContainer">
		<Textfield
			variant="outlined"
			type="number"
			bind:value={$recipePreviewStore.recipeYield}
			label="Portionen"
			style="max-width: 10rem;"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={$recipePreviewStore.prepTime}
			label="Vorbereitungszeit"
			style="min-width: 3rem;max-width: 10rem;"
			suffix="min"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={$recipePreviewStore.cookTime}
			label="Koch-/Backzeit"
			style="min-width: 3rem;max-width: 10rem;"
			suffix="min"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={$recipePreviewStore.restingTime}
			label="Ruhezeit"
			style="min-width: 3rem;max-width: 10rem;"
			suffix="min"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={$recipePreviewStore.totalTime}
			label="Gesamtzeit"
			style="min-width: 3rem;max-width: 10rem;"
			suffix="min"
			input$emptyValueUndefined
		/>
	</div>
	<Textfield
		style="width: 100%;min-height: 10rem;"
		helperLine$style="width: 100%;"
		textarea
		label="Zutaten"
		required
		bind:value={$ingredients}
	/>
	<Textfield
		style="width: 100%;min-height: 10rem;"
		helperLine$style="width: 100%;"
		textarea
		label="Zubereitung"
		required
		bind:value={$instructions}
	/>
	<Textfield
		variant="outlined"
		type="text"
		style="width: 100%;"
		helperLine$style="width: 100%;"
		label="Rezeptbild (URL)"
		bind:value={$recipeImageUrls}
		input$emptyValueUndefined
	/>
	<Textfield
		variant="outlined"
		type="file"
		label="Rezeptbild (Datei)"
		bind:files={$recipeImageFiles}
	/>
	<Textfield
		variant="outlined"
		style="width: 100%"
		helperLine$style="width: 100%;"
		type="text"
		label="Labels/Kategorien (Komma-getrennt)"
		bind:value={$keywords}
	/>
	<Textfield
		style="width: 100%;"
		helperLine$style="width: 100%;"
		textarea
		label="Kommentar"
		bind:value={$recipePreviewStore.comment}
		input$emptyValueUndefined
	/>
	<Textfield
		variant="outlined"
		type="text"
		style="width: 100%;"
		helperLine$style="width: 100%;"
		label="Quelle"
		bind:value={$recipePreviewStore.sourceUrl}
		input$emptyValueUndefined
	/>
	<Button class="submitButton" on:click={addRecipeToDatabase} variant="unelevated">Speichern</Button>
</div>


<style lang="scss">
	.recipePreviewContainer {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.recipePreviewTimesContainer {
			display: flex;
			flex-direction: row;
			gap: 1rem;
		}

		:global(input[type='file']::file-selector-button) {
			display: none;
		}

		:global(:not(.mdc-text-field--label-floating) input[type='file']) {
			color: transparent;
		}
	}
</style>
