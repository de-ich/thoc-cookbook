<script lang="ts">
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import { AspectRatio } from '$lib/shadcn/aspect-ratio/index.js';
	import type { RecipeCardProps } from './index.js';

	type $$Props = RecipeCardProps;

	export let recipe: $$Props['recipe'];
</script>

<a href={'/recipes/' + recipe.id}>
	<div
		class="flex h-20 flex-row items-center gap-4 overflow-hidden rounded-lg border hover:border-primary hover:bg-accent hover:text-accent-foreground"
	>
		<div class="w-36 shrink-0 overflow-hidden rounded-lg bg-muted">
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
		<div class="max-h-20 overflow-hidden pb-1 pr-1 pt-1"><h6 class="overflow-hidden">{recipe.name}</h6></div>
	</div>
</a>
