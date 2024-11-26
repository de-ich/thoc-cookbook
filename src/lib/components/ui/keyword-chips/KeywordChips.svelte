<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import CircleX from 'lucide-svelte/icons/circle-x';
	import { IconButton } from '$lib/components/ui/icon-button';

	export let selectedKeywords: string[] = [];

	$: removeKeyword = (keyword: string) => {
		const index = selectedKeywords.indexOf(keyword);
		if (index >= 0) {
			selectedKeywords.splice(index, 1);
			selectedKeywords = selectedKeywords;
		}
	}
</script>

<div class="flex items-center gap-2 m-2">
	{#each selectedKeywords as selectedKeyword}
		<Badge variant="secondary" class="whitespace-nowrap">
			{selectedKeyword}
			<IconButton on:click={() => removeKeyword(selectedKeyword)} class="h-5 w-5 ml-2">
				<CircleX class="h-4 w-4"></CircleX>
			</IconButton>
		</Badge>
	{/each}
</div>

