import Root from './KeywordSpecifier.svelte';
import type { HTMLBaseAttributes } from 'svelte/elements';

type KeywordSpecifierProps = HTMLBaseAttributes & {
	label: string;
	availableKeywords: string[];
	selectedKeywords: string[];
};

export {
	Root,
	Root as KeywordFilter,
	type KeywordSpecifierProps,
	type KeywordSpecifierProps as Props
};

export default Root;
