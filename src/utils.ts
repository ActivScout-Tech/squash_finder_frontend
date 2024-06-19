export function getQueryParams(url: string) {
	const queryParams = {};
	const parser = new URL(url);
	parser.searchParams.forEach((value, key) => {
		queryParams[key] = value;
	});
	return queryParams;
}
