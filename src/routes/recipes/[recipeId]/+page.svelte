<script lang="ts">
	import { goto } from '$app/navigation';
	import type { RecipeDetails } from '$lib/database/Recipe';
	import { IconButton } from '$lib/components/icon-button';
	import Copy from 'lucide-svelte/icons/copy';
	import ChefHat from 'lucide-svelte/icons/chef-hat';
	import Pencil from 'lucide-svelte/icons/pencil';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import { PUBLIC_IMAGEKIT_STORAGE_URL } from '$env/static/public';
	import IngredientsList from '$lib/components/ingredients-list';
	import InstructionsList from '$lib/components/instructions-list';
	import ConfirmDeleteRecipeDialog from '$lib/dialogs/confirm-delete-recipe-dialog';
	import { addEntryToHistory } from '$lib/firebase/history';
	import KeywordChips from '$lib/components/keyword-chips';
	import { RecipeTime } from '$lib/components/recipe-time';
	import { Separator } from '$lib/shadcn/separator';
	import { page } from '$app/state';
	import { getServingsFromQuery, updateServingsInQuery } from '$lib/servings-handler';

	interface Props {
		/** @type {import('./$types').PageData} */
		data: any;
	}
	
	let { data }: Props = $props();
	let recipe: RecipeDetails = data.recipe;
	
	const initialServings = getServingsFromQuery();

	let showConfirmDeleteDialog = $state(false);

	addEntryToHistory(recipe.id);
</script>

<div class="flex flex-row flex-wrap items-center gap-4">
	<h3>{recipe.name}</h3>
	<div>
		<IconButton onclick={() => navigator.clipboard.writeText(window.location.href)}>
			<Copy class="h-4 w-4" />
		</IconButton>
		<IconButton onclick={() => goto(`/recipes/${recipe.id}/focus?${page.url.searchParams.toString()}`)}>
			<ChefHat class="h-4 w-4" />
		</IconButton>
		<IconButton onclick={() => goto(`/recipes/${recipe.id}/edit`)}>
			<Pencil class="h-4 w-4" />
		</IconButton>
		<IconButton onclick={() => (showConfirmDeleteDialog = true)}>
			<Trash2 class="h-4 w-4" />
		</IconButton>
	</div>
</div>

{#if (recipe.images || []).length > 0 && typeof recipe.images[0] === 'string'}
	<div class="mt-4">
		<img
			class="h-40 rounded-lg"
			src={PUBLIC_IMAGEKIT_STORAGE_URL + 'tr:h-200/' + recipe.images[0]}
			alt="recipeImage"
		/>
	</div>
{/if}

{#if (recipe.keywords || []).length > 0}
	<div class="my-4">
		<KeywordChips selectedKeywords={recipe.keywords.filter((keyword) => keyword)} nonInteractive />
	</div>
{/if}

{#if recipe.prepTime || recipe.cookTime || recipe.restingTime || recipe.totalTime}
	<div class="mt-8 flex flex-row flex-wrap gap-x-4 gap-y-1">
		<RecipeTime label="Vorbereitungszeit:" timeInMinutes={recipe.prepTime} />
		<RecipeTime label="Koch-/Backzeit:" timeInMinutes={recipe.cookTime} />
		<RecipeTime label="Ruhezeit:" timeInMinutes={recipe.restingTime} />
		<RecipeTime label="Gesamtzeit:" timeInMinutes={recipe.totalTime} />
	</div>
{/if}

{#if recipe.sourceUrl}
	<div class="mt-8 flex flex-row flex-nowrap items-center gap-2 overflow-hidden">
		<ExternalLink class="h-4 w-4" />
		<span class="font-semibold">Quelle:</span>
		<a
			class="hover:bg-accent overflow-hidden text-ellipsis whitespace-nowrap"
			href={recipe.sourceUrl}>{recipe.sourceUrl}</a
		>
	</div>
{/if}

<div class="mt-8 flex flex-col items-start gap-8 md:flex-row">
	<div class="max-w-96">
		<IngredientsList {recipe} initialYield={initialServings} yieldChangedCallback={updateServingsInQuery} />
	</div>

	<Separator orientation="vertical" class="hidden h-40 md:inline-block" />

	<div class="instructionsAndCommentContainer">
		<div class="mb-8 max-w-xl grow">
			<InstructionsList {recipe} />
		</div>

		{#if recipe.comment}
			<div class="commentsContainer">
				<h6>Kommentar:</h6>
				<div class="commentContainer">
					{recipe.comment}
				</div>
			</div>
		{/if}
	</div>
</div>

<ConfirmDeleteRecipeDialog {recipe} bind:open={showConfirmDeleteDialog} />
