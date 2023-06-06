<script lang="ts">
	import Textfield from '@smui/textfield';
	import { getEmptyRecipePreview, type RecipePreview } from '$lib/database/Recipe';
	import { parseIngredient } from '$lib/ingredient-parser';

	// either pass in an existing Recipe/RecipePreview (when editing a recipe) or use an
	// empty preview (when creating a new recipe)
	export let recipePreview: RecipePreview = getEmptyRecipePreview();

	let instructions = recipePreview.instructions.join('\n');
	$: {
		recipePreview.instructions = instructions.split('\n').map((instruction) => instruction.trim());
	}

	let ingredients = recipePreview.ingredients
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
		.join('\n');

	$: {
		recipePreview.ingredients = parseIngredient(ingredients);
	}

	let keywords = recipePreview.keywords.join(', ');
	$: {
		recipePreview.keywords = keywords.split(',').map((keyword) => keyword.trim());
	}

	let recipeImageUrls = recipePreview.images
		.filter((image) => typeof image === 'string')
		.join('\n');
	$: {
		const existingImageFiles = recipePreview.images.filter((image) => typeof image !== 'string');
		const newImages: (string | File)[] = [];
		newImages.push(...existingImageFiles);
		newImages.push(...recipeImageUrls.split('\n').map((imageUrl) => imageUrl.trim()));
		recipePreview.images = newImages;
	}

	let recipeImageFiles: FileList;
	$: {
		const existingImageUrl = recipePreview.images.filter((image) => typeof image === 'string');
		const newImages: (string | File)[] = [];
		newImages.push(...existingImageUrl);
		if (recipeImageFiles) {
			for (let file of recipeImageFiles) {
				newImages.push(file);
			}
		}
		recipePreview.images = newImages;
	}
</script>

<div class="recipePreviewContainer">
	<Textfield
		id="recipeTitle"
		variant="outlined"
		type="text"
		bind:value={recipePreview.name}
		label="Rezepttitel"
		style="min-width: 25rem;"
		required
	/>
	<div class="recipePreviewTimesContainer">
		<Textfield
			variant="outlined"
			type="number"
			bind:value={recipePreview.recipeYield}
			label="Portionen"
			style="max-width: 10rem;"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={recipePreview.prepTime}
			label="Vorbereitungszeit"
			style="min-width: 3rem;max-width: 10rem;"
			suffix="min"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={recipePreview.cookTime}
			label="Koch-/Backzeit"
			style="min-width: 3rem;max-width: 10rem;"
			suffix="min"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={recipePreview.restingTime}
			label="Ruhezeit"
			style="min-width: 3rem;max-width: 10rem;"
			suffix="min"
			input$emptyValueUndefined
		/>
		<Textfield
			variant="outlined"
			type="number"
			bind:value={recipePreview.totalTime}
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
	<Textfield
		variant="outlined"
		style="width: 100%"
		helperLine$style="width: 100%;"
		type="text"
		label="Labels/Kategorien (Komma-getrennt)"
		bind:value={keywords}
	/>
	<Textfield
		style="width: 100%;"
		helperLine$style="width: 100%;"
		textarea
		label="Kommentar"
		bind:value={recipePreview.comment}
		input$emptyValueUndefined
	/>
	<Textfield
		variant="outlined"
		type="text"
		style="width: 100%;"
		helperLine$style="width: 100%;"
		label="Quelle"
		bind:value={recipePreview.sourceUrl}
		input$emptyValueUndefined
	/>
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