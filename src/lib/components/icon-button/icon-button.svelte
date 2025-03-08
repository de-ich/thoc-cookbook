<script lang="ts" module>
	import { Button } from '$lib/shadcn/button/index.js';
	import { type Props } from '$lib/shadcn/button';

	export type ButtonProps = Omit<Props, 'variant' | 'size'>;
</script>

<script lang="ts">
	let { class: className = '', children, ...restProps }: ButtonProps = $props();
</script>

<Button variant="ghost" size="icon" class={className} {...restProps}>
	{@render children?.()}
</Button>
