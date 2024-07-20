<script lang="ts">
	import type {
		RecipePreviews,
		RecipePreviewWithId,
		RecipeSortFunction
	} from '$lib/database/Recipe';
	import RecipeCard from '../../components/RecipeCard.svelte';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import IconButton from '@smui/icon-button';
	import Menu, { SelectionGroupIcon } from '@smui/menu';
	import List, { Item, Separator, Text } from '@smui/list';
	import KeywordFilter from '../../components/KeywordFilter.svelte';
	import KeywordChips from '../../components/KeywordChips.svelte';
	import { getAllKeywords, getAllRecipePreviews } from '$lib/firebase/recipe';
	import { createError } from '../../stores/errormessagestore';
	import algoliasearch from 'algoliasearch/lite';
	import { PUBLIC_ALGOLIA_APPID, PUBLIC_ALGOLIA_APIKEY } from '$env/static/public';

	enum SortMethod {
		ALPHABETICALLY_UP,
		ALPHABETICALLY_DOWN
	}

	let allRecipes: RecipePreviewWithId[] = [];
	let filteredRecipes: RecipePreviewWithId[] = [];
	let searchText: string | undefined;
	let keywords: string[] = [];
	let selectedKeywords: string[];
	let loadingRecipes = true;
	let sortMethod: SortMethod = SortMethod.ALPHABETICALLY_UP;
	let sortMenu: Menu;

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

	const sortRecipes = (recipes: RecipePreviewWithId[], sortMethod: SortMethod) => {
		let sortFunction: RecipeSortFunction;

		if (sortMethod === SortMethod.ALPHABETICALLY_DOWN) {
			sortFunction = (recipe1, recipe2) => {
				let name1 = recipe1.name.toLowerCase();
				let name2 = recipe2.name.toLowerCase();
				if (name1 > name2) {
					return -1;
				}
				if (name1 < name2) {
					return 1;
				}
				return 0;
			};
		} else {
			// use 'alphabetically up' as default
			sortFunction = (recipe1, recipe2) => {
				let name1 = recipe1.name.toLowerCase();
				let name2 = recipe2.name.toLowerCase();
				if (name1 < name2) {
					return -1;
				}
				if (name1 > name2) {
					return 1;
				}
				return 0;
			};
		}

		return recipes.sort(sortFunction);
	};

	$: {
		startSearch();
		loadingRecipes = loadingRecipes;
		selectedKeywords = selectedKeywords;
	}

	$: sortedFilteredRecipes = sortRecipes(filteredRecipes, sortMethod);
</script>

<div class="recipeList">
	<div class="searchAndFilterArea">
		<div class="keywordFilter">
			<KeywordFilter availableKeywords={keywords} bind:selectedKeywords />
		</div>
		<div class="searchField">
			<Textfield
				class="searchField"
				variant="outlined"
				bind:value={searchText}
				label="Rezept suchen..."
				input$emptyValueUndefined
				on:keyup={startSearch}
				on:blur={startSearch}
			>
				<Icon class="material-icons" slot="leadingIcon">search</Icon>
				<IconButton
					class="material-icons"
					slot="trailingIcon"
					on:click={() => {
						searchText = undefined;
						document
							.querySelector('.searchField label')
							?.classList.remove('mdc-text-field--focused');
						document
							.querySelector('.searchField label>div')
							?.classList.remove('mdc-notched-outline--notched');
						startSearch();
					}}>clear</IconButton
				>
			</Textfield>
		</div>
		{#if (selectedKeywords || []).length > 0}
			<div class="keywordChips">
				<KeywordChips bind:selectedKeywords />
			</div>
		{/if}
	</div>
	{#if loadingRecipes}
		<div class="loadingContainer">
			<h6>Rezepte werden geladen...</h6>
		</div>
	{:else}
		<div class="sortArea">
			<h6>{filteredRecipes.length} Rezepte gefunden</h6>
			<Menu bind:this={sortMenu} anchorCorner="BOTTOM_LEFT">
				<List>
					<Item on:SMUI:action={() => (sortMethod = SortMethod.ALPHABETICALLY_UP)}>
						<SelectionGroupIcon>
							{#if sortMethod === SortMethod.ALPHABETICALLY_UP}
								<i class="material-icons">check</i>
							{/if}
						</SelectionGroupIcon>
						<Text>Alphabetisch (aufsteigend)</Text>
					</Item>
					<Item on:SMUI:action={() => (sortMethod = SortMethod.ALPHABETICALLY_DOWN)}>
						<SelectionGroupIcon
							>{#if sortMethod === SortMethod.ALPHABETICALLY_DOWN}
								<i class="material-icons">check</i>
							{/if}
						</SelectionGroupIcon>
						<Text>Alphabetisch (absteigend)</Text>
					</Item>
				</List>
			</Menu>
			<IconButton
				class="material-icons"
				slot="trailingIcon"
				on:click={() => {
					sortMenu.setOpen(true);
				}}>sort</IconButton
			>
		</div>
		{#each sortedFilteredRecipes as recipe}
			<RecipeCard {recipe} />
		{/each}
	{/if}
</div>

<style lang="scss">
	.recipeList {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		.searchAndFilterArea {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			column-gap: 1rem;

			@media (max-width: 800px) {
				flex-direction: column;
			}

			.searchField {
				flex-grow: 1;
				flex-shrink: 0;

				:global(label) {
					width: 100%;
				}
			}

			.keywordFilter {
				flex-basis: 20%;

				@media (max-width: 800px) {
					order: 1;
				}
			}

			.keywordChips {
				flex-basis: 100%;
				@media (max-width: 800px) {
					order: 2;
				}
			}
		}

		.sortArea {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		:global(.searchField) {
			flex-grow: 1;
		}
	}

	.loadingContainer {
		display: flex;
		direction: column;
		justify-content: center;
		margin-top: 5rem;
	}
</style>
