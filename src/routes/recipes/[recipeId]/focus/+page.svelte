<script lang="ts">
	import { goto } from '$app/navigation';
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { RecipeYieldType } from '$lib/database/Recipe';
	import IconButton from '@smui/icon-button';
	import List, { Item, Text } from '@smui/list';
	import Chip, { Set, Text as ChipText } from '@smui/chips';
	import Dialog, { Actions, Content, Title } from '@smui/dialog';
	import { createError } from '../../../../stores/errormessagestore';
	import { deleteRecipe } from '$lib/firebase/recipe';
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import IngredientsList from '$lib/components/ui/ingredients-list';
	import InstructionsList from '../../../../components/InstructionsList.svelte';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: RecipeDetails = data.recipe;
</script>

<div class="headingContainer">
	<h4>{recipe.name}</h4>
</div>

<div class="ingredientsAndInstructionsContainer">
	<div class="ingredientsContainer">
		<IngredientsList {recipe} allowCheckItems={true} />
	</div>

	<div class="instructionsAndCommentContainer">
		<div class="instructionsContainer">
			<InstructionsList {recipe} allowCheckItems={true} />
		</div>
	</div>
</div>

<style lang="scss">
	.ingredientsAndInstructionsContainer {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		column-gap: 2rem;
		row-gap: 2rem;
		margin-top: 2rem;

		@media (max-width: 800px) {
			flex-direction: column;
		}
	}

	.ingredientsContainer {
		max-width: 25rem;
	}

	.instructionsContainer {
		flex-grow: 1;
		margin-bottom: 2rem;
		max-width: 35rem;
	}
</style>
