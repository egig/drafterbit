module.exports = {
	/**
	 * Sidebar
	 */
	sidebar: {
		position: "fixed",
		top: 0,
		bottom: 0,
		left: 0,
		zIndex: 100, /* Behind the navbar */
		padding: 0,
		boxShadow: "inset -1px 0 0 rgba(0, 0, 0, .1)"
	},

	sidebarSticky: {
		position: "sticky",
		top: "48px", /* Height of navbar */
		height: "calc(100vh - 48px)",
		paddingTop: ".5rem",
		overflowX: "hidden",
		overflowY: "auto" /* Scrollable contents if viewport is shorter than content. */
	},


	sidebarNavLink: {
		fontWeight: 500,
		color: "#333",
	},

	sidebarHeading: {
		fontSize: ".75rem",
		textTransform: "uppercase",
	}
}