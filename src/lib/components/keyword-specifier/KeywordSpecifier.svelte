<script lang="ts">
	import { Button } from '$lib/shadcn/button/index.js';
	import * as Popover from '$lib/shadcn/popover/index.js';
	import * as Command from '$lib/shadcn/command/index.js';
	import type { HTMLBaseAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils.js';

	export type Props = HTMLBaseAttributes & {
		label: string;
		availableKeywords: string[];
		selectedKeywords: string[];
	};

	let {
		class: className = undefined,
		label,
		availableKeywords,
		selectedKeywords = $bindable()
	}: Props = $props();

	let remainingKeywords = $derived(
		availableKeywords.filter((keyword) => !selectedKeywords.includes(keyword))
	);

	let open = $state(false);

	const addKeyword = (keyword: string) => {
		if ((keyword || '').length > 0 && !selectedKeywords.includes(keyword)) {
			selectedKeywords.push(keyword);
		}
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		<Button
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class={cn('w-[200px] justify-between', className)}
		>
			{label}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Label suchen..." />
			<Command.Empty>Kein Label gefunden.</Command.Empty>
			<Command.Group>
				{#each remainingKeywords as keyword}
					<Command.Item value={keyword} onselect={() => addKeyword(keyword)}>
						{keyword}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
