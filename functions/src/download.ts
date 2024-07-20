import { HttpsError, onCall } from 'firebase-functions/v2/https';

export const downloadFile = onCall({ maxInstances: 1 }, async (request) => {
	const url = request.data.url as string;

	if (!url) {
		throw new HttpsError(
			'invalid-argument',
			`Unable to to download file because no file URL was passed in the request data!`
		);
	}

	const response = await fetch(url).catch((error) => {
		throw new HttpsError(
			'not-found',
			`Unable to to download file from ${url}. The following error was returned by the server: ${(error as Error)?.message || ''}`
		);
	});

	if (!response.ok) {
		throw new HttpsError(
			'not-found',
			`Unable to to download file from ${url}. The following status text was returned by the server: ${response.statusText}`
		);
	}

	const fileBuffer = await response
		.arrayBuffer()
		.then((arrayBuffer) => Buffer.from(arrayBuffer))
		.catch((error) => {
			throw new HttpsError(
				'not-found',
				`Unable to to download file from ${url}. The following error occurred while trying to decode retrieved response: ${(error as Error)?.message || ''}`
			);
		});

	const contentType = response.headers.get('Content-Type');
	const fileBase64 = 'data:' + contentType + ';base64,' + fileBuffer.toString('base64');

	return {
		dataUrl: fileBase64,
		contentType: contentType
	};
});
