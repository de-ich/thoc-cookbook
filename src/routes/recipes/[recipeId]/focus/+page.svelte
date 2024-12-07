<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import IngredientsList from '$lib/components/ingredients-list';
	import InstructionsList from '$lib/components/instructions-list';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: RecipeDetails = data.recipe;
</script>

<div class="headingContainer">
	<h4>{recipe.name}</h4>
</div>

<div class="mt-8 flex flex-col items-start gap-x-10 gap-y-10 md:flex-row">
	<div>
		<IngredientsList {recipe} allowCheckItems={true} />
	</div>

	<div class="instructionsAndCommentContainer">
		<div class="mb-8 max-w-xl flex-grow">
			<InstructionsList {recipe} allowCheckItems={true} />
		</div>
	</div>
</div>
