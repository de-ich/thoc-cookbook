<script lang="ts">
	import type { RecipePreview } from '$lib/database/Recipe';
	import RecipeCard from '../../components/RecipeCard.svelte';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Icon from '@smui/textfield/icon';
	import Fuse from 'fuse.js';
	import IconButton from '@smui/icon-button';
	import KeywordFilter from '../../components/KeywordFilter.svelte';
	import Chip, { Set, TrailingAction, Text } from '@smui/chips';
	import { getAllRecipePreviews } from '$lib/firebase/recipe';
	import { createError } from '../../stores/errormessagestore';

	let allRecipes: RecipePreview[] = [];
	let filteredRecipes: RecipePreview[] = [];
	let fuse: Fuse<RecipePreview>;
	let searchText: string | undefined;
	let selectedKeywords: string[];
	let loadingRecipes = true;

	getAllRecipePreviews()
		.then((recipes) => {
			allRecipes = recipes;
			filteredRecipes = [...recipes];
			fuse = new Fuse(recipes, {
				keys: ['name'],
				threshold: 0.2
			});
		})
		.catch((error) => createError('Unable to retrieve recipes: ' + error.message || ''))
		.finally(() => (loadingRecipes = false));

	const startSearchOnEnter = (keyboardEvent: Event) => {
		const keyCode = (keyboardEvent as KeyboardEvent)?.keyCode;
		if (keyCode === 13) {
			startSearch();
		}
	};

	const startSearch = () => {
		let recipes = [...allRecipes];
		if (searchText) {
			const searchResult = fuse?.search(searchText);
			recipes = searchResult?.map((result) => result.item) || [];
		}

		if (selectedKeywords && selectedKeywords.length > 0) {
			recipes = recipes.filter((recipe) =>
				selectedKeywords.every((k) => recipe.keywords.includes(k))
			);
		}

		filteredRecipes = recipes.filter((recipes) => recipes.keywords);
	};

	$: {
		startSearch();
		selectedKeywords = selectedKeywords;
	}
</script>

<div class="recipeList">
	<div class="searchAndFilterArea">
		<div class="keywordFilter">
			<KeywordFilter
				availableKeywords={allRecipes.flatMap((recipe) => recipe.keywords)}
				bind:selectedKeywords
			/>
		</div>
		<div class="searchField">
			<Textfield
				class="searchField"
				variant="outlined"
				bind:value={searchText}
				label="Rezept suchen..."
				input$emptyValueUndefined
				on:keydown={startSearchOnEnter}
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
				<HelperText slot="helper">Suche starten mit Enter</HelperText>
			</Textfield>
		</div>
		{#if (selectedKeywords || []).length > 0}
			<div class="keywordChips">
				<Set style="display: inline-block;" bind:chips={selectedKeywords} let:chip>
					<Chip {chip}>
						<Text tabindex={0}>{chip}</Text>
						<TrailingAction icon$class="material-icons">cancel</TrailingAction>
					</Chip>
				</Set>
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
