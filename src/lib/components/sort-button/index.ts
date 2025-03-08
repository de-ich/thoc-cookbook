import Root, { type Props } from './SortButton.svelte';

enum SortMethod {
	ALPHABETICALLY,
	LAST_ACCESS_TIME
}

enum SortOrder {
	UP,
	DOWN
}

export {
	Root,
	Root as SortButton,
	type Props,
	type Props as SortButtonProps,
	SortMethod,
	SortOrder
};

export default Root;
