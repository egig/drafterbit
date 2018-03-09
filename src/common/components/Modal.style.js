module.exports = {
	modalActive: {},
	modalTrap: {
		display: 'none',
		position: 'fixed',
		top: '0',
		bottom: '0',
		left: '0',
		right: '0',
		zIndex: 100,
		backgroundColor: "rgba(0,0,0,0.6)",
		'&$modalActive': {
			display: 'block'
		},
	},
	dialogContainer: {
		backgroundColor: "rgba(255,255,255,1)",
		width: '520px',
		padding: '20px',
		borderRadius: '2px',
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)"
	}
};