<script lang="ts">
	import type {
		RecipePreviews,
		RecipePreviewWithId,
		RecipeCompareFunction
	} from '$lib/database/Recipe';
	import RecipeCard from '$lib/components/ui/recipe-card';
	import KeywordSpecifier from '$lib/components/ui/keyword-specifier';
	import KeywordChips from '$lib/components/ui/keyword-chips';
	import { getAllKeywords, getAllRecipePreviews } from '$lib/firebase/recipe';
	import { createError } from '../../stores/errormessagestore';
	import algoliasearch from 'algoliasearch/lite';
	import { PUBLIC_ALGOLIA_APPID, PUBLIC_ALGOLIA_APIKEY } from '$env/static/public';
	import { getHistory, type HistoryEntry } from '$lib/firebase/history';
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte/icons';
	import { SortButton, SortMethod, SortOrder } from '$lib/components/ui/sort-button';

	let allRecipes: RecipePreviewWithId[] = [];
	let filteredRecipes: RecipePreviewWithId[] = [];
	let sortedFilteredRecipes: RecipePreviewWithId[] = [];
	let searchText: string | undefined;
	let keywords: string[] = [];
	let historyEntries: HistoryEntry[] = [];
	let selectedKeywords: string[] = [];
	let loadingRecipes = true;
	let sortMethod: SortMethod = SortMethod.LAST_ACCESS_TIME;
	let sortOrder: SortOrder = SortOrder.DOWN;

	const searchClient = algoliasearch(PUBLIC_ALGOLIA_APPID, PUBLIC_ALGOLIA_APIKEY);
	const searchIndex = searchClient.initIndex('recipeDetails');

	export const snapshot: import('./$types').Snapshot<any> = {
		capture: () => {
			return {
				searchText: searchText,
				selectedKeywords: selectedKeywords
			};
		},
		restore: (snapshot: any) => {
			searchText = snapshot.searchText;
			selectedKeywords = snapshot.selectedKeywords;
		}
	};

	const convertToListOfRecipePreviewsWithId = (recipePreviews: RecipePreviews) => {
		return Object.entries(recipePreviews).map((e) => {
			return { ...e[1], id: e[0] } as RecipePreviewWithId;
		});
	};

	getAllRecipePreviews()
		.then(convertToListOfRecipePreviewsWithId)
		.then((recipes) => {
			allRecipes = recipes;
			filteredRecipes = [...recipes];
		})
		.catch((error) => createError('Unable to retrieve recipes: ' + error.message || ''))
		.finally(() => (loadingRecipes = false));

	getAllKeywords().then((kw) => (keywords = [...kw]));
	getHistory().then((h) => (historyEntries = h.entries));

	const startSearch = async () => {
		let keywordFilteredRecipes = filterRecipesByKeywords(allRecipes);
		filteredRecipes = await createSearchFunction(searchText)(keywordFilteredRecipes);
	};

	const createSearchFunction = (searchText: string | undefined) => {
		if (searchText && searchText.length > 3) {
			return async (recipes: RecipePreviewWithId[]) => {
				return await searchIndex
					.search(searchText)
					.then(({ hits }) => {
						return recipes.filter((recipe) => hits.some((hit) => hit.objectID === recipe.id));
					})
					.catch((err) => {
						console.log(err);
						return [];
					});
			};
		} else {
			return (recipes: RecipePreviewWithId[]) => {
				return [...recipes];
			};
		}
	};

	const filterRecipesByKeywords = (recipes: RecipePreviewWithId[]) => {
		if (selectedKeywords && selectedKeywords.length > 0) {
			return recipes.filter((recipe) => selectedKeywords.every((k) => recipe.keywords.includes(k)));
		}

		return [...recipes];
	};

	const sortRecipes = (
		recipes: RecipePreviewWithId[],
		historyEntries: HistoryEntry[],
		sortMethod: SortMethod,
		sortOrder: SortOrder
	) => {
		let compareFunction: RecipeCompareFunction = compareRecipesAlphabetically; // default

		if (sortMethod === SortMethod.LAST_ACCESS_TIME) {
			compareFunction = (recipe1, recipe2) =>
				compareRecipesByAccessTime(recipe1, recipe2, historyEntries);
		}

		let orderedCompareFunction: RecipeCompareFunction = compareFunction; // default

		if (sortOrder === SortOrder.DOWN) {
			orderedCompareFunction = (recipe1, recipe2) => compareFunction(recipe1, recipe2) * -1;
		}

		return [...recipes].sort(orderedCompareFunction);
	};

	const compareRecipesAlphabetically = (
		recipe1: RecipePreviewWithId,
		recipe2: RecipePreviewWithId
	) => {
		let name1 = recipe1.name.toLowerCase();
		let name2 = recipe2.name.toLowerCase();
		if (name1 > name2) {
			return 1;
		}
		if (name1 < name2) {
			return -1;
		}
		return 0;
	};

	const compareRecipesByAccessTime = (
		recipe1: RecipePreviewWithId,
		recipe2: RecipePreviewWithId,
		historyEntries: HistoryEntry[]
	) => {
		let time1 = historyEntries.find((e) => e.recipeId == recipe1.id)?.timestamp || 0;
		let time2 = historyEntries.find((e) => e.recipeId == recipe2.id)?.timestamp || 0;
		if (time1 > time2) {
			return 1;
		}
		if (time2 < time1) {
			return -1;
		}
		return 0;
	};

	$: {
		searchText = searchText;
		startSearch();
		loadingRecipes = loadingRecipes;
		selectedKeywords = selectedKeywords;
	}

	$: {
		sortedFilteredRecipes = sortRecipes(filteredRecipes, historyEntries, sortMethod, sortOrder);
	}
</script>

<div class="flex w-full flex-col gap-4">
	<div class="flex flex-col flex-wrap gap-x-4 gap-y-2 md:flex-row">
		<Input
			inputId="recipeSearch"
			label="Rezept suchen..."
			showClearIcon
			bind:value={searchText}
			class="order-1 flex-shrink-0 flex-grow basis-3/5 md:order-2"
		>
			<Search slot="icon" class="h-4 w-4" />
		</Input>
		<KeywordSpecifier
			label="Nach Label filtern..."
			availableKeywords={keywords}
			bind:selectedKeywords
			class="order-2 h-auto basis-1/5 md:order-1"
		/>
		{#if (selectedKeywords || []).length > 0}
			<KeywordChips bind:selectedKeywords class="order-3 basis-full" />
		{/if}
	</div>
	{#if loadingRecipes}
		<div class="mt-20 flex flex-col justify-center">
			<h6>Rezepte werden geladen...</h6>
		</div>
	{:else}
		<div class="flex flex-row items-center gap-2">
			<h6>{filteredRecipes.length} Rezepte gefunden</h6>
			<SortButton bind:currentSortMethod={sortMethod} bind:currentSortOrder={sortOrder} />
		</div>
		{#each sortedFilteredRecipes as recipe}
			<RecipeCard {recipe} />
		{/each}
	{/if}
</div>
