/**
 *  TODO move this to module
 *
 * @param fqStr
 */
export function parseFilterQuery(fqStr) {

	if(!fqStr) {
		return;
	}

	return fqStr.split(";").map((s) => {
		let t = s.split(":");
		return {
			k: t[0],
			v: t[1]
		}
	}).reduce((acc, curr) => {
		acc[curr.k] = curr.v;
		return acc;
	}, {})
}


/**
 *  TODO move this to module
 *
 * @param fqObj
 */
export function stringifyFilterQuery(fqObj) {

	let fL = [];
	Object.keys(fqObj).forEach((k) => {
		fL.push(`${k}:${fqObj[k]}`)
	});

	return fL.join(";");
}