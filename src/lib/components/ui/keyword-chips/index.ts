import Root from './KeywordChips.svelte';
import type { HTMLBaseAttributes } from 'svelte/elements';

type KeywordChipsProps = HTMLBaseAttributes & {
	selectedKeywords?: string[];
};

export { Root, Root as KeywordChips, type KeywordChipsProps, type KeywordChipsProps as Props };

export default Root;
