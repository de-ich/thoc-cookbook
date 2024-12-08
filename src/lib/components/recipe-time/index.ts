import Root from './RecipeTime.svelte';
import type { HTMLBaseAttributes } from 'svelte/elements';

type RecipeTimeProps = HTMLBaseAttributes & {
	label: string;
	timeInMinutes: number | null;
};

export { Root, Root as RecipeTime, type RecipeTimeProps, type RecipeTimeProps as Props };

export default Root;
