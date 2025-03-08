<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';
	import { clsx } from 'clsx';

	export type Props = {
		text: string;
		actionIsRunning: boolean;
	};

	let { text, actionIsRunning }: Props = $props();
</script>

<span class={clsx(actionIsRunning && 'invisible')}>{text}</span><LoaderCircle
	class={clsx('absolute h-4 w-4 animate-spin', !actionIsRunning && 'invisible')}
/>
