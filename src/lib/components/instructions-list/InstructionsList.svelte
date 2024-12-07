<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { Checkbox } from '$lib/shadcn/checkbox';

	export let recipe: RecipeDetails;
	export let allowCheckItems = false;
</script>

<div class="flex flex-col">
	<h5 class="mb-4 flex items-center overflow-y-hidden h-5 max-h-5">Zubereitung:</h5>
	{#each recipe.instructions as instruction, i}
		<div class="mb-2 flex flex-row items-center">
			{#if allowCheckItems}
				<Checkbox class="peer mr-3" />
			{/if}
			<span id={'instruction-' + i} class="peer-aria-checked:text-muted-foreground">
				{instruction}
			</span>
		</div>
	{/each}
</div>
