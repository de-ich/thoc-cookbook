<script lang="ts">
	import { Button } from '$lib/shadcn/button/index.js';
	import * as Popover from '$lib/shadcn/popover/index.js';
	import * as Command from '$lib/shadcn/command/index.js';

	import type { KeywordSpecifierProps } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = KeywordSpecifierProps;

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let label: $$Props['label'];
	export let availableKeywords: $$Props['availableKeywords'];
	export let selectedKeywords: $$Props['selectedKeywords'];

	$: remainingKeywords = availableKeywords.filter((keyword) => !selectedKeywords.includes(keyword));

	let open = false;

	const addKeyword = async (keyword: string) => {
		if ((keyword || '').length > 0 && !selectedKeywords.includes(keyword)) {
			selectedKeywords.push(keyword);
			// Make sure everything relying on the keywords gets updated
			selectedKeywords = selectedKeywords;
		}
	};
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
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
					<Command.Item value={keyword} onSelect={addKeyword}>
						{keyword}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
