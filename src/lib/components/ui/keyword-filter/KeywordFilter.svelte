<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';

	import type { KeywordFilterProps } from './index.js';
	import { cn } from '$lib/utils.js';

	type $$Props = KeywordFilterProps;

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let availableKeywords: string[];
	export let selectedKeywords: string[] = [];

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

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class={cn("w-[200px] justify-between", className)}
		>
			Nach Label filtern...
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
