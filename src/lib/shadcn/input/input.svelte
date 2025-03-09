<script lang="ts">
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
	import type { WithElementRef } from 'bits-ui';
	import { Label } from '$lib/shadcn/label';
	import { IconButton } from '$lib/components/icon-button';
	import { X } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';
	import type { Snippet } from 'svelte';

	type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

	type Props = WithElementRef<
		Omit<HTMLInputAttributes, 'type'> &
			({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined }) & {
				inputId: string;
				inputClass?: string;
				label?: string;
				required?: boolean;
				showClearIcon?: boolean;
				suffix?: string;
				icon?: Snippet;
			}
	>;

	let {
		icon,
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
	let isInvalidClassName = $derived(
		isValid ? '' : 'border-destructive focus-visible:ring-destructive'
	);
	let labelClassName = $derived(isValid ? '' : 'text-destructive');
</script>

<div
	class={cn(
		'border-input bg-background ring-offset-background focus-within:border-ring relative flex w-full items-center rounded-md border px-3 py-2 text-sm',
		className,
		isInvalidClassName
	)}
>
	<!-- (optional) icon at the beginning of the input passed via the 'icon' slot -->
	{#if icon}
		<span class="mr-2">
			{@render icon?.()}
		</span>
	{/if}

	<!-- Actual input -->
	{#if type === 'file'}
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
				'bg-background text-muted-foreground peer-focus:text-foreground absolute top-0 -translate-x-1 -translate-y-1/2 px-1 text-xs font-normal peer-focus:font-semibold',
				labelClassName
			)}>{labelValue}</Label
		>
	{/if}
	<!-- (optional) Suffix displayed at the end of the input field-->
	{#if suffix}
		<span class="text-muted-foreground pl-2">{suffix}</span>
	{/if}
	<!-- (optional) Icon button to clear the input-->
	{#if showClearIcon}
		<IconButton onclick={() => (value = undefined)}>
			<X class="h-4 w-4" />
		</IconButton>
	{/if}
</div>
