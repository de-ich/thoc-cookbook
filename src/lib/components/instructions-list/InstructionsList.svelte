<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { Checkbox } from '$lib/shadcn/checkbox';

	export type Props = {
		recipe: RecipeDetails;
		allowCheckItems?: boolean;
	};

	let { recipe, allowCheckItems = false }: Props = $props();
</script>

<div class="flex flex-col">
	<h5 class="mb-4 flex h-5 max-h-5 items-center overflow-y-hidden">Zubereitung:</h5>
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
