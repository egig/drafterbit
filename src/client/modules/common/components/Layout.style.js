module.exports = {
    /*
	 * Navbar
	 */
    navbar: {
        zIndex: 101
    },
    navbarBrand: {
        paddingTop: '.75rem',
        paddingBottom: '.75rem',
        fontSize: '1rem',
        backgroundColor: 'rgba(0, 0, 0, .25)',
        boxShadow: 'inset -1px 0 0 rgba(0, 0, 0, .25)'
    },

    navbarBrandImg: {
        maxWidth: '98px',
    },

    navbarForm: {
        width: '100%',
        '& $navbarProjectSelector': {
            borderRadius: '0px',
            maxWidth: '180px',
            border: '0px',
            background: 'transparent',
            outline: 'none',
            color: '#eaeaea',

            '&:focus': {
                background: 'transparent',
                borderRadius: '0px',
            }
        },
    },

    navbarProjectSelector: {}

};

// .form-control-dark:focus {
// 	border-color: transparent;
// 	box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
// }

/*
 * Utilities
 */

// .border-top { border-top: 1px solid #e5e5e5; }
// .border-bottom { border-bottom: 1px solid #e5e5e5; }