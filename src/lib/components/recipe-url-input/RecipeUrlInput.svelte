<script lang="ts">
	import { Input } from "$lib/shadcn/input";

    export type Props = {
		recipeUrl?: string;
	};

	let { recipeUrl = $bindable()  }: Props = $props();
</script>

<Input
    inputId="recipeUrl"
    type="url"
    min="0"
    bind:value={recipeUrl}
    label="Rezept-URL"
    placeholder="Rezept-URL"
    required
/>