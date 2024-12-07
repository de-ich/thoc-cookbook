<script lang="ts">
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import { AspectRatio } from '$lib/shadcn/aspect-ratio/index.js';
	import type { RecipeCardProps } from './index.js';

	type $$Props = RecipeCardProps;

	export let recipe: $$Props['recipe'];
</script>

<a href={'/recipes/' + recipe.id}>
	<div
		class="flex h-20 flex-row items-center gap-4 overflow-hidden rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground"
	>
		<div class="w-36 shrink-0 overflow-hidden rounded-lg bg-muted-foreground">
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
		<div><span class="font-semibold">{recipe.name}</span></div>
	</div>
</a>
