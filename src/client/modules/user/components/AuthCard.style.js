export default {

    brandContainer: {
        textAlign: 'center'
    },

    brandImg: {
        height: '28px',
        margin: '64px auto'
    },

    cardWrapper: {
        fontSize: '14px',
        width: '400px',
        margin: '0 auto'
    },

    cardFatPadding: {
        padding: '10px'
    },

    cardTitleMargin: {
        marginBottom: '30px',
    },

    loginFooter: {
        margin: '40px 0',
        color: '#888',
        textAlign: 'center'
    },

    '@media screen and (max-width: 425px)': {
        cardWrapper: {
            width: '90%',
            margin: '0 auto'
        }
    },

    '@media screen and (max-width: 320px)': {
        cardFatPadding: {
            padding: 0
        },

        cardBodyPadding: {
            padding: '15px'
        }
    }

};