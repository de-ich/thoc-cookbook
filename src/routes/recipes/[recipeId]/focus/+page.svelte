<script lang="ts">
	import type { RecipeDetails } from '$lib/database/Recipe';
	import IngredientsList from '$lib/components/ingredients-list';
	import InstructionsList from '$lib/components/instructions-list';
	import { Separator } from '$lib/shadcn/separator';
	import { getServingsFromQuery, updateServingsInQuery } from '$lib/servings-handler';
	import { IconButton } from '$lib/components/icon-button';
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	
	interface Props {
		/** @type {import('./$types').PageData} */
		data: any;
	}

	let { data }: Props = $props();
	let recipe: RecipeDetails = data.recipe;

	const initialServings = getServingsFromQuery();
	
	let wakeLock: any = null;

	const requestWakeLock  = async () => {

		try {
			wakeLock = await navigator.wakeLock.request('screen');
			wakeLock.addEventListener('release', () => {
				console.log('Wakelock released');
			});
			console.log('Wakelock acquired');
		} catch (err: Error | any) {
			console.error(`Error acquiring wakelock: ${err.name}, ${err.message}`);
		}
	};

	const handleVisibilityChange = () => {
		if (wakeLock !== null && document.visibilityState === 'visible') {
			requestWakeLock();
		}
	}

	if ('wakeLock' in navigator) {
		// initial wake lock request
		requestWakeLock();
	
		// reaquire wake lock if tab is re-focused
		document.addEventListener('visibilitychange', handleVisibilityChange);
	}
</script>

<div class="flex flex-row flex-wrap items-center gap-4">
	<h4>{recipe.name}</h4>
	<div>
		<IconButton onclick={() => goto(`/recipes/${recipe.id}?${page.url.searchParams.toString()}`)}>
			<ArrowLeft class="h-4 w-4" />
		</IconButton>
	</div>
</div>

<div class="mt-8 flex flex-col items-start gap-x-10 gap-y-10 md:flex-row">
	<div>
		<IngredientsList {recipe} initialYield={initialServings} yieldChangedCallback={updateServingsInQuery} allowCheckItems={true} />
	</div>

	<Separator orientation="vertical" class="hidden md:inline-block h-40" />

	<div class="instructionsAndCommentContainer">
		<div class="mb-8 max-w-xl grow">
			<InstructionsList {recipe} allowCheckItems={true} />
		</div>
	</div>
</div>
