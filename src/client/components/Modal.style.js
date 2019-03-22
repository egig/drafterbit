export default {
    modalTrap: {
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    dialogContainer: {
        backgroundColor: 'rgba(255,255,255,1)',
        width: '520px',
        padding: '20px',
        borderRadius: '2px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    modalEnter: {
        opacity: 0.01
    },
    modalEnterActive: {
        opacity: 1,
        transition: 'opacity 200ms ease-in'
    },
    modalLeave: {
        opacity: 1
    },
    modalLeaveActive: {
        opacity: 0.01,
        transition: 'opacity 200ms ease-in'
    },
    modalAppear: {
        opacity: 0.01
    },
    modalAppearActive: {
        opacity: 1,
        transition: 'opacity 200ms ease-in'
    },

};