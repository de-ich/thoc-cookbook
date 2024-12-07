<script lang="ts">
	import { Button } from "$lib/shadcn/button/index.js";
	import { type Events, type Props } from "./index.js";

	type $$Events = Events;
	type $$Props = Props;

	let className: $$Props["class"] = undefined;
	export let builders: $$Props["builders"] = [];
	export { className as class };
</script>

<Button 
	{builders}
	variant="ghost" 
	size="icon" 
	class="{className}"
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</Button>
