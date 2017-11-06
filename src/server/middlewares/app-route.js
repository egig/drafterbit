const getController =  function (req, res, next) {
	next();
};

const frontEnd =  function (req, res, next) {
	next();
};


export default function (req, res, next) {

	if(/^(?!(?:backend|blog)(?:\/|$)).*$/.test(req.url.substr(1))) {
		return frontEnd(req, res, next)
	} else {
		return getController(req, res, next);
	}
}