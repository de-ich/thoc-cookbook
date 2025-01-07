import * as cheerio from 'cheerio';

// FIXME does not work on Firebase Functions, probably related to: https://stackoverflow.com/questions/77779601/error-could-not-find-chrome-ver-119-0-6045-105-this-can-occur-if-either

const getContent = async (url: string) => {
	
	const response = await fetch(url);
	const resonseText = await response.text();

	const html = cheerio.load(resonseText);

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
