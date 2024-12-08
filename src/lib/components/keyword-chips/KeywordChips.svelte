<script lang="ts">
	import { Badge } from '$lib/shadcn/badge/index.js';
	import CircleX from 'lucide-svelte/icons/circle-x';
	import { IconButton } from '$lib/components/icon-button';

	import type { KeywordChipsProps } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = KeywordChipsProps;

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let selectedKeywords: $$Props['selectedKeywords'];
	export let nonInteractive: $$Props['nonInteractive'] = false;

	$: removeKeyword = (keyword: string) => {
		const index = selectedKeywords.indexOf(keyword);
		if (index >= 0) {
			selectedKeywords.splice(index, 1);
			selectedKeywords = selectedKeywords;
		}
	};
</script>

<div class={cn('flex items-center gap-2', className)}>
	{#each selectedKeywords as selectedKeyword}
		<Badge variant="secondary" class="whitespace-nowrap text-sm">
			{selectedKeyword}
			{#if !nonInteractive}
				<IconButton on:click={() => removeKeyword(selectedKeyword)} class="ml-2 h-5 w-5">
					<CircleX class="h-4 w-4"></CircleX>
				</IconButton>
			{/if}
		</Badge>
	{/each}
</div>
