import Root from './KeywordFilter.svelte';
import type { HTMLBaseAttributes } from 'svelte/elements';

type KeywordFilterProps = HTMLBaseAttributes & {
	availableKeywords: string[];
	selectedKeywords?: string[];
};

export { Root, Root as KeywordFilter, type KeywordFilterProps, type KeywordFilterProps as Props };

export default Root;
