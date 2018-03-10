module.exports = {
	loaderActive: {},
	loaderTrap: {
		display: 'none',
		position: 'fixed',
		top: '0',
		bottom: '0',
		left: '0',
		right: '0',
		zIndex: 100,
		backgroundColor: "rgba(255,255,255,0.7)",
		'&$loaderActive': {
			display: 'block'
		},
	},
	loaderImgContainer: {
		background: "transparent",
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	}
};