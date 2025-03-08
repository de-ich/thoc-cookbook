<script lang="ts">
	import { cn } from '$lib/utils.js';
	import Clock from 'lucide-svelte/icons/clock';
	import type { HTMLAttributes } from 'svelte/elements';

	export type Props = HTMLAttributes<HTMLDivElement> & {
		label: string;
		timeInMinutes: number | null;
	};

	let { label, timeInMinutes = null, class: className, ...restProps }: Props = $props();
</script>

{#if timeInMinutes}
	<div class={cn('flex flex-row items-center gap-2', className)} {...restProps}>
		<Clock class="h-4 w-4" />
		<span class="font-semibold">{label}</span>
		<span>{timeInMinutes}min</span>
	</div>
{/if}
