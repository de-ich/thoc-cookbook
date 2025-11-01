import { goto } from '$app/navigation';
import { page } from '$app/state';

export const getServingsFromQuery = () => {
	const yieldParam = Number.parseFloat(page.url.searchParams.get('servings') ?? '');
	return Number.isNaN(yieldParam) ? undefined : yieldParam;
};

export const updateServingsInQuery = (newServings: number) => {
	page.url.searchParams.set('servings', newServings.toString());
	goto(page.url.pathname + '?' + page.url.searchParams.toString(), {
		keepFocus: true,
		replaceState: true
	});
};