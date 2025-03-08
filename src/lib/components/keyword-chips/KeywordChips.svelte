<script lang="ts">
	import { Badge } from '$lib/shadcn/badge/index.js';
	import CircleX from 'lucide-svelte/icons/circle-x';
	import { IconButton } from '$lib/components/icon-button';
	import type { HTMLBaseAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	export type Props = HTMLBaseAttributes & {
		selectedKeywords: string[];
		nonInteractive?: boolean;
	};

	let {
		class: className = undefined,
		selectedKeywords = $bindable(),
		nonInteractive = false
	}: Props = $props();

	const removeKeyword = (keyword: string) => {
		const index = selectedKeywords.indexOf(keyword);
		if (index >= 0) {
			selectedKeywords.splice(index, 1);
		}
	};
</script>

<div class={cn('flex items-center gap-2', className)}>
	{#each selectedKeywords as selectedKeyword}
		<Badge variant="secondary" class="text-sm whitespace-nowrap">
			{selectedKeyword}
			{#if !nonInteractive}
				<IconButton onclick={() => removeKeyword(selectedKeyword)} class="ml-2 h-5 w-5">
					<CircleX class="h-4 w-4"></CircleX>
				</IconButton>
			{/if}
		</Badge>
	{/each}
</div>
