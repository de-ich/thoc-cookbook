<script lang="ts">
	import { IconButton } from '$lib/components/ui/icon-button';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import {
		ArrowDownAZ,
		ArrowUpAZ,
		CalendarArrowDown,
		CalendarArrowUp,
		Check
	} from 'lucide-svelte/icons';

	import { type SortButtonProps, SortMethod, SortOrder } from './index.js';

	type $$Props = SortButtonProps;

	let open = false;
	export let currentSortMethod: $$Props['currentSortMethod'] = SortMethod.LAST_ACCESS_TIME;
	export let currentSortOrder: $$Props['currentSortOrder'] = SortOrder.DOWN;

	const setSorting = (sortMethod: SortMethod, sortOrder: SortOrder) => {
		currentSortMethod = sortMethod;
		currentSortOrder = sortOrder;
		open = false;
	};
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<IconButton builders={[builder]} {...$$restProps}>
			{#if currentSortMethod === SortMethod.LAST_ACCESS_TIME && currentSortOrder === SortOrder.DOWN}
				<CalendarArrowDown class="h-4 w-4" />
			{:else if currentSortMethod === SortMethod.LAST_ACCESS_TIME && currentSortOrder === SortOrder.UP}
				<CalendarArrowUp class="h-4 w-4" />
			{:else if currentSortMethod === SortMethod.ALPHABETICALLY && currentSortOrder === SortOrder.DOWN}
				<ArrowUpAZ class="h-4 w-4" />
			{:else}
				<ArrowDownAZ class="h-4 w-4" />
			{/if}
		</IconButton>
	</Popover.Trigger>
	<Popover.Content class="p-0">
		<Command.Root>
			<Command.Group>
				<Command.Item onSelect={() => setSorting(SortMethod.ALPHABETICALLY, SortOrder.UP)}
					>Alphabetisch (aufsteigend)
					{#if currentSortMethod === SortMethod.ALPHABETICALLY && currentSortOrder === SortOrder.UP}
						<Check class="ml-auto h-4 w-4" />
					{/if}
				</Command.Item>
				<Command.Item onSelect={() => setSorting(SortMethod.ALPHABETICALLY, SortOrder.DOWN)}
					>Alphabetisch (absteigend)
                    {#if currentSortMethod === SortMethod.ALPHABETICALLY && currentSortOrder === SortOrder.DOWN}
                    <Check class="ml-auto h-4 w-4" />
                    {/if}</Command.Item
				>
				<Command.Item onSelect={() => setSorting(SortMethod.LAST_ACCESS_TIME, SortOrder.UP)}
					>Zuletzt angeschaut (älteste zuerst)
                    {#if currentSortMethod === SortMethod.LAST_ACCESS_TIME && currentSortOrder === SortOrder.UP}
                    <Check class="ml-auto h-4 w-4" />
                    {/if}</Command.Item
				>
				<Command.Item onSelect={() => setSorting(SortMethod.LAST_ACCESS_TIME, SortOrder.DOWN)}
					>Zuletzt angeschaut (neueste zuerst)
                    {#if currentSortMethod === SortMethod.LAST_ACCESS_TIME && currentSortOrder === SortOrder.DOWN}
                    <Check class="ml-auto h-4 w-4" />
                    {/if}</Command.Item
				>
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
