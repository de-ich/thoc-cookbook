<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
	import type { WithElementRef } from "bits-ui";
	import { Label } from '$lib/shadcn/label';
	import { IconButton } from '$lib/components/icon-button';
	import { X } from 'lucide-svelte';
	import { cn } from "$lib/utils.js";

	type InputType = Exclude<HTMLInputTypeAttribute, "file">;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, "type"> &
			({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined }) & 
			{
				inputId: string;
				inputClass?: string;
				label?: string;
				required?: boolean;
				showClearIcon? : boolean;
				suffix?: string;
			}
	>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		type,
		files = $bindable(),
		class: className,
		inputId,
		inputClass,
		label,
		required,
		showClearIcon,
		suffix,
		...restProps
	}: Props = $props();

	let inputBaseClassName =
		'peer placeholder:text-muted-foreground flex grow h-10 leading-10 w-full file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50';

	let labelValue = $derived(required ? `${label}*` : label);

	let isValid = $derived((required ?? false) ? (value?.length ?? 0) > 0 : true);
	let isInvalidClassName = $derived(isValid ? '' : 'border-destructive focus-visible:ring-destructive');
	let labelClassName = $derived(isValid ? '' : 'text-destructive');
</script>

<div
	class={cn(
		'relative flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:border-ring',
		className,
		isInvalidClassName
	)}
>
	<!-- (optional) icon at the beginning of the input passed via the 'icon' slot -->
	{#if $$slots.icon}
		<span class="mr-2">
			<slot name="icon"></slot>
		</span>
	{/if}

	<!-- Actual input -->
	{#if type === "file"}
		<input
			bind:this={ref}
			class={cn(inputBaseClassName, inputClass)}
			type="file"
			bind:files
			bind:value
			{...restProps}
		/>
	{:else}
		<input
			bind:this={ref}
			class={cn(inputBaseClassName, inputClass)}
			{type}
			bind:value
			{...restProps}
		/>
	{/if}

	<!-- (optional) Label (displayed as part of the top border of the input)-->
	{#if label}
		<Label
			for={inputId}
			class={cn(
				'absolute top-0 -translate-x-1 -translate-y-1/2 bg-background px-1 text-xs font-normal text-muted-foreground peer-focus:font-semibold peer-focus:text-foreground',
				labelClassName
			)}>{labelValue}</Label
		>
	{/if}
	<!-- (optional) Suffix displayed at the end of the input field-->
	{#if suffix}
		<span class="pl-2 text-muted-foreground">{suffix}</span>
	{/if}
	<!-- (optional) Icon button to clear the input-->
	{#if showClearIcon}
		<IconButton on:click={() => (value = undefined)}>
			<X class="h-4 w-4" />
		</IconButton>
	{/if}
</div>