const createBrowserless = require('browserless');
const getHTML = require('html-get');
import * as cheerio from 'cheerio';

const getContent = async (url: string) => {
	// Spawn Chromium process once
	const browserlessFactory = createBrowserless();

	// create a browser context inside Chromium process
	const browserContext = browserlessFactory.createContext();
	const getBrowserless = () => browserContext;
	const result = await getHTML(url, { getBrowserless });

	// close the browser context after it's used
	await getBrowserless().then((browser: any) => browser.destroyContext());

	browserlessFactory.close();

	const html = cheerio.load(result.html);

	// try to get the main content
	let content = html('main');
	if (content.length === 0) {
		content = html('body');
	}

	const $ = cheerio.load(content.html() || '');

	// remove unnecessary elements
	$(
		'script, style, noscript, iframe, header, footer, template, svg, noscript, aside, video, audio, nav, button'
	).remove();

	// Function to serialize the HTML to JSON
	const serializeToJSON = (element: cheerio.Cheerio<any>): Object => {
		const children = element
			.contents()
			.map((i, el) => {
				if (el.type === 'text') {
					const text = el.data?.trim();
					return text ? text : null;
				} else if (el.type === 'tag') {
					const child = serializeToJSON($(el));
					return child && Object.keys(child).length > 0 ? { [el.tagName]: child } : null;
				}
				return null;
			})
			.get()
			.filter(Boolean);

		return children.length === 1 && typeof children[0] === 'string' ? children[0] : children;
	};

	const jsonContent = serializeToJSON(content);

	return jsonContent;
};

export default getContent;
