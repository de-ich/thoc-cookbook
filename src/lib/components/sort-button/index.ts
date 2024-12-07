import Root from './SortButton.svelte';

import { type IconButtonProps } from '$lib/components/icon-button';

enum SortMethod {
	ALPHABETICALLY,
	LAST_ACCESS_TIME
}

enum SortOrder {
	UP,
	DOWN
}

type SortButtonProps = IconButtonProps & {
	currentSortMethod: SortMethod;
	currentSortOrder: SortOrder;
};

export {
	Root,
	Root as SortButton,
	type SortButtonProps,
	type SortButtonProps as Props,
	SortMethod,
	SortOrder
};

export default Root;
