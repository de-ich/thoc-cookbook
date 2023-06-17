<script lang="ts">
	import type { Recipe } from '$lib/database/Recipe';
	import { db } from '$lib/firebase/firebase.client';
	import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
	import RecipeCard from '../../components/RecipeCard.svelte';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Icon from '@smui/textfield/icon';
	import Fuse from 'fuse.js';
	import IconButton from '@smui/icon-button';
	import KeywordFilter from '../../components/KeywordFilter.svelte';
	import Chip, { Set, TrailingAction, Text } from '@smui/chips';

	let allRecipes: Recipe[] = [];
	let filteredRecipes: Recipe[] = [];
	let fuse: Fuse<Recipe>;
	let searchText: string | undefined;
	let selectedKeywords: string[];
	let loadingRecipes = true;

	const recipesRef = collection(db, 'recipes');
	const getAllRecipes = () =>
		getDocs(query(recipesRef, orderBy('name'))).then((querySnapshot) =>
			querySnapshot.docs.map((doc) => doc.data() as Recipe)
		);

	getAllRecipes().then((recipes) => {
		allRecipes = recipes;
		filteredRecipes = [...recipes];
		fuse = new Fuse(recipes, {
			keys: ['name'],
			threshold: 0.2
		});
		loadingRecipes = false;
	});

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
		<div class="keywordFilter">
			<KeywordFilter
				availableKeywords={allRecipes.flatMap((recipe) => recipe.keywords)}
				bind:selectedKeywords
			/>
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

			.searchField {
				flex-grow: 1;
				flex-shrink: 0;

				:global(label) {
					width: 100%;
				}
			}

			.keywordFilter {
				order: -1;
				flex-basis: 20%;
			}

			.keywordChips {
				flex-basis: 100%;
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
