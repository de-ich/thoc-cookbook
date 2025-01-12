<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import { clsx } from 'clsx';

	export let text: string;
	export let actionIsRunning: boolean;
</script>

<span class={clsx(actionIsRunning && 'invisible')}>{text}</span><LoaderCircle
	class={clsx('absolute h-4 w-4 animate-spin', !actionIsRunning && 'invisible')}
/>
