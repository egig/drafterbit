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
	},

	/*
	 * Navbar
	 */
	navbar: {
		zIndex: 101
	},
	navbarBrand: {
		paddingTop: ".75rem",
		paddingBottom: ".75rem",
		fontSize: "1rem",
		backgroundColor: "rgba(0, 0, 0, .25)",
		boxShadow: "inset -1px 0 0 rgba(0, 0, 0, .25)"
	}

}

// .form-control-dark:focus {
// 	border-color: transparent;
// 	box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
// }

/*
 * Utilities
 */

// .border-top { border-top: 1px solid #e5e5e5; }
// .border-bottom { border-bottom: 1px solid #e5e5e5; }