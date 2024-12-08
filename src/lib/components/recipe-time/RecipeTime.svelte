<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { RecipeTimeProps } from './index.js';
	import Clock from 'lucide-svelte/icons/clock';

	type $$Props = RecipeTimeProps;

	export let label: $$Props['label'];
	export let timeInMinutes: $$Props['timeInMinutes'] = null;

    let className: $$Props['class'] = undefined;
    export { className as class };
</script>

{#if timeInMinutes}
	<div class={cn("flex flex-row items-center gap-2", className)} {...$$restProps}>
		<Clock class="h-4 w-4" />
		<span class="font-semibold">{label}</span>
		<span>{timeInMinutes}min</span>
	</div>
{/if}
