import type { Button as ButtonPrimitive } from "bits-ui";
import Root from "./icon-button.svelte";

type Props = ButtonPrimitive.Props;
type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as IconButton,
	type Props as IconButtonProps,
	type Events as IconButtonEvents,
};
