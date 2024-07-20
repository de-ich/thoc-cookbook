import { redirect } from '@sveltejs/kit';
import { RECIPES_PAGE_ROUTE } from './routes';

export function load() {
	redirect(307, RECIPES_PAGE_ROUTE);
}
