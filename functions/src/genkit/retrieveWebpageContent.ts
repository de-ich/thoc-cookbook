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

	const $ = cheerio.load(result.html);
	$('script, style, noscript, iframe, header, footer, template').remove();

	return $('body').html();
};

export default getContent;