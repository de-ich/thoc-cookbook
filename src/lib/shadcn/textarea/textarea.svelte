<script lang="ts">
	import type { WithElementRef, WithoutChildren } from "bits-ui";
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import { Label } from '$lib/shadcn/label';
	import { cn } from "$lib/utils.js";

	type Props = WithoutChildren<WithElementRef<HTMLTextareaAttributes & {
		inputId: string;
		inputClass?: string;
		label?: string;
		required?: boolean;
	}>>;

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		inputId,
		inputClass,
		label,
		required,
		...restProps
	}: Props = $props();

	let inputBaseClassName = 'placeholder:text-muted-foreground flex h-full w-full rounded-md text-sm focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 resize-none px-3';

	let labelValue = $derived(required ? `${label}*` : label);

	let isValid = $derived((required ?? false) ? (value?.toString().length ?? 0) > 0 : true);
	let isInvalidClassName = $derived(isValid ? '' : 'border-destructive focus-visible:ring-destructive');
	let labelClassName = $derived(isValid ? '' : 'text-destructive');
</script>

<div class="relative">
	<div class={cn("relative border-input bg-background ring-offset-background w-full rounded-md border py-4 text-sm flex items-center focus-within:border-ring resize-y min-h-40 h-40 overflow-auto peer", className, isInvalidClassName)}>
		<!-- Actual input -->
		 <textarea
			bind:this={ref}
			class={cn(inputBaseClassName, inputClass)}
			bind:value
			{...restProps}
		></textarea>
	</div>
	<!-- (optional) Label (displayed as part of the top border of the input)-->
	{#if label}
		<Label for={inputId} class={cn("absolute -translate-x-1 -translate-y-1/2 bg-background px-1 top-0 text-muted-foreground font-normal text-xs peer-focus-within:text-foreground peer-focus-within:font-semibold mx-3", labelClassName)}>{labelValue}</Label>
	{/if}
</div>
