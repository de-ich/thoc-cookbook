<script lang="ts">
	import type { RecipePreview, RecipePreviews } from '$lib/database/Recipe';
	import RecipeCard from '../../components/RecipeCard.svelte';
	import Textfield from '@smui/textfield';
	import Icon from '@smui/textfield/icon';
	import IconButton from '@smui/icon-button';
	import KeywordFilter from '../../components/KeywordFilter.svelte';
	import KeywordChips from '../../components/KeywordChips.svelte';
	import { getAllKeywords, getAllRecipePreviews } from '$lib/firebase/recipe';
	import { createError } from '../../stores/errormessagestore';
	import algoliasearch from 'algoliasearch/lite';
	import { PUBLIC_ALGOLIA_APPID, PUBLIC_ALGOLIA_APIKEY } from '$env/static/public';

	let allRecipes: RecipePreview[] = [];
	let filteredRecipes: RecipePreview[] = [];
	let searchText: string | undefined;
	let keywords: string[] = [];
	let selectedKeywords: string[];
	let loadingRecipes = true;

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

	const convertRecipePreviewsDictToRecipePreviewList = (recipePreviews: RecipePreviews) => {
		return Object.entries(recipePreviews).map((e) => {
			return { ...e[1], id: e[0] };
		});
	};

	getAllRecipePreviews()
		.then(convertRecipePreviewsDictToRecipePreviewList)
		.then((recipes) => {
			return recipes.sort((recipe1: RecipePreview, recipe2: RecipePreview) => {
				let name1 = recipe1.name.toLowerCase();
				let name2 = recipe2.name.toLowerCase();
				if (name1 < name2) {
					return -1;
				}
				if (name1 > name2) {
					return 1;
				}
				return 0;
			});
		})
		.then((sortedRecipes) => {
			allRecipes = sortedRecipes;
			filteredRecipes = [...sortedRecipes];
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
			return async (recipes: RecipePreview[]) => {
				return await searchIndex.search(searchText).then(({ hits }) => {
					return recipes.filter(recipe => hits.some((hit) => hit.objectID === recipe.id));
				})
				.catch(err => {
					console.log(err);
					return [];
				});
			}
		} else {
			return (recipes: RecipePreview[]) => {
				return [...recipes];
			}
		}
	}

	const filterRecipesByKeywords = (recipes: RecipePreview[]) => {
		if (selectedKeywords && selectedKeywords.length > 0) {
			return recipes.filter((recipe) =>
				selectedKeywords.every((k) => recipe.keywords.includes(k))
			);
		}

		return [...recipes];
	}

	$: {
		startSearch();
		loadingRecipes = loadingRecipes;
		selectedKeywords = selectedKeywords;
	}
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
				<KeywordChips bind:selectedKeywords={selectedKeywords} />
			</div>
		{/if}
	</div>
	{#if loadingRecipes}
		<div class="loadingContainer">
			<h6>Rezepte werden geladen...</h6>
		</div>
	{:else}
		<h6>{filteredRecipes.length} Rezepte gefunden</h6>
		{#each filteredRecipes as recipe}
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
