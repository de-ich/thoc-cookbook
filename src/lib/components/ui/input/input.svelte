<script lang="ts">
	import type { InputEvents, InputProps } from "./index.js";
	import { Label } from '$lib/components/ui/label';
	import { cn } from "$lib/utils.js";

	type $$Props = InputProps;
	type $$Events = InputEvents;

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props["readonly"] = undefined;

	export let type: $$Props['type'] = 'text';

	export let inputId: $$Props['inputId'];
	export let inputClass: $$Props['inputClass'] = undefined;
	export let label: $$Props['label'] = undefined;
	export let required: $$Props['required'] = false;
	export let suffix: $$Props['suffix'] = undefined;
	export let files: $$Props['files'] = undefined;

	let inputBaseClassName = 'peer placeholder:text-muted-foreground flex h-10 leading-10 w-full file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50';							  

	$: labelValue = required ? `${label}*` : label;

	$: isValid = (required ?? false) ? (value?.length ?? 0) > 0 : true;
	$: isInvalidClassName = (isValid ? '' : 'border-destructive focus-visible:ring-destructive');
	$: labelClassName = isValid ? '' : 'text-destructive';
</script>

<div class={cn("relative border-input bg-background ring-offset-background w-full rounded-md border px-3 py-2 text-sm flex items-center focus-within:border-ring", className, isInvalidClassName)}>
	<!-- Actual input -->
	{#if type !== 'file'}
		<input
			class={cn(inputBaseClassName, inputClass, "focus-")}
			bind:value
			{readonly}
			on:blur
			on:change
			on:click
			on:focus
			on:focusin
			on:focusout
			on:keydown
			on:keypress
			on:keyup
			on:mouseover
			on:mouseenter
			on:mouseleave
			on:mousemove
			on:paste
			on:input
			on:wheel|passive
			{...$$restProps}
		/>
	{:else}
	<!-- file input needs to be treated differently, see https://github.com/huntabyte/shadcn-svelte/discussions/286 and https://github.com/huntabyte/shadcn-svelte/issues/478 -->
		<input
			class={cn(inputBaseClassName, inputClass)}
			type="file"
			bind:value
			bind:files
			{readonly}
			on:blur
			on:change
			on:click
			on:focus
			on:focusin
			on:focusout
			on:keydown
			on:keypress
			on:keyup
			on:mouseover
			on:mouseenter
			on:mouseleave
			on:mousemove
			on:paste
			on:input
			on:wheel|passive
			{...$$restProps}
		/>
	{/if}
	<!-- (optional) Label (displayed as part of the top border of the input)-->
	{#if label}
		<Label for={inputId} class={cn("absolute -translate-x-1 -translate-y-1/2 bg-background px-1 top-0 text-muted-foreground font-normal text-xs peer-focus:text-foreground peer-focus:font-semibold", labelClassName)}>{labelValue}</Label>
	{/if}
	<!-- (optional) Suffix displayed at the end of the input field-->
	{#if suffix}
		<span class="pl-2 text-muted-foreground">{suffix}</span>
	{/if}
</div>
