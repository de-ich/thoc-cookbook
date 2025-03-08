<script lang="ts">
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import { AspectRatio } from '$lib/shadcn/aspect-ratio/index.js';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import type { RecipePreviewWithId } from '$lib/database/Recipe';

	export type Props = HTMLBaseAttributes & {
		recipe: RecipePreviewWithId;
	};

	let { recipe }: Props = $props();
</script>

<a href={'/recipes/' + recipe.id}>
	<div
		class="hover:border-primary hover:bg-accent hover:text-accent-foreground flex h-20 flex-row items-center gap-4 overflow-hidden rounded-lg border"
	>
		<div class="bg-muted w-36 shrink-0 overflow-hidden rounded-lg">
			<AspectRatio ratio={16 / 9}>
				{#if recipe.previewImage}
					<img
						src={PUBLIC_IMAGEKIT_STORAGE_URL + 'tr:h-80/' + recipe.previewImage}
						alt="recipePreviewImage"
						loading="lazy"
						draggable="false"
						class="h-full w-full object-cover transition duration-700 ease-in-out hover:scale-110"
					/>
				{/if}
			</AspectRatio>
		</div>
		<div class="max-h-20 overflow-hidden pt-1 pr-1 pb-1">
			<h6 class="overflow-hidden">{recipe.name}</h6>
		</div>
	</div>
</a>
