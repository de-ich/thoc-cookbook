<script lang="ts">
	import type { TextareaEvents, TextareaProps } from "./index.js";
	import { Label } from '$lib/shadcn/label/index.js';
	import { cn } from "$lib/utils.js";

	type $$Props = TextareaProps;
	type $$Events = TextareaEvents;

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props["readonly"] = undefined;

	export let inputId: $$Props['inputId'];
	export let inputClass: $$Props['inputClass'] = undefined;
	export let label: $$Props['label'] = undefined;
	export let required: $$Props['required'] = false;

	let inputBaseClassName = 'placeholder:text-muted-foreground flex h-full w-full rounded-md text-sm focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none px-3';

	$: labelValue = required ? `${label}*` : label;

	$: isValid = (required ?? false) ? (value?.length ?? 0) > 0 : true;
	$: isInvalidClassName = (isValid ? '' : 'border-destructive focus-visible:ring-destructive');
	$: labelClassName = isValid ? '' : 'text-destructive';
</script>

<div class="relative">
	<div class={cn("relative border-input bg-background ring-offset-background w-full rounded-md border py-4 text-sm flex items-center focus-within:border-ring resize-y min-h-40 h-40 overflow-auto peer", className, isInvalidClassName)}>
		<!-- Actual input -->
		<textarea
			class={cn(inputBaseClassName, inputClass)}
			bind:value
			{readonly}
			on:blur
			on:change
			on:click
			on:focus
			on:keydown
			on:keypress
			on:keyup
			on:mouseover
			on:mouseenter
			on:mouseleave
			on:paste
			on:input
			{...$$restProps}
		></textarea>
		<!-- (optional) Label (displayed as part of the top border of the input)-->
	</div>
	{#if label}
		<Label for={inputId} class={cn("absolute -translate-x-1 -translate-y-1/2 bg-background px-1 top-0 text-muted-foreground font-normal text-xs peer-focus-within:text-foreground peer-focus-within:font-semibold mx-3", labelClassName)}>{labelValue}</Label>
	{/if}
</div>
