<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import IngredientsList from '$lib/components/ingredients-list';
	import InstructionsList from '$lib/components/instructions-list';
	import { Separator } from '$lib/shadcn/separator';
	import { getServingsFromQuery, updateServingsInQuery } from '$lib/servings-handler';

	
	interface Props {
		/** @type {import('./$types').PageData} */
		data: any;
	}

	let { data }: Props = $props();
	let recipe: RecipeDetails = data.recipe;

	const initialServings = getServingsFromQuery();
	
</script>

<div class="headingContainer">
	<h4>{recipe.name}</h4>
</div>

<div class="mt-8 flex flex-col items-start gap-x-10 gap-y-10 md:flex-row">
	<div>
		<IngredientsList {recipe} initialYield={initialServings} yieldChangedCallback={updateServingsInQuery} allowCheckItems={true} />
	</div>

	<Separator orientation="vertical" class="hidden md:inline-block h-40" />

	<div class="instructionsAndCommentContainer">
		<div class="mb-8 max-w-xl grow">
			<InstructionsList {recipe} allowCheckItems={true} />
		</div>
	</div>
</div>
