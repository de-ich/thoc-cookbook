<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import IngredientsList from '$lib/components/ui/ingredients-list';
	import InstructionsList from '$lib/components/ui/instructions-list';

	/** @type {import('./$types').PageData} */
	export let data: any;

	let recipe: RecipeDetails = data.recipe;
</script>

<div class="headingContainer">
	<h4>{recipe.name}</h4>
</div>

<div class="flex flex-col md:flex-row items-start gap-x-10 gap-y-10 mt-8">
	<div>
		<IngredientsList {recipe} allowCheckItems={true} />
	</div>

	<div class="instructionsAndCommentContainer">
		<div class="flex-grow mb-8 max-w-xl">
			<InstructionsList {recipe} allowCheckItems={true} />
		</div>
	</div>
</div>
