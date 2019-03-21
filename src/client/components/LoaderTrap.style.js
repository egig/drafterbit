export default{
    loaderTrap: {
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: 100,
        backgroundColor: 'rgba(255,255,255,0.7)'
    },
    loaderImgContainer: {
        background: 'transparent',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    loaderEnter: {
        opacity: 0.01
    },
    loaderEnterActive: {
        opacity: 1,
        transition: 'opacity 200ms ease-in'
    },
    loaderLeave: {
        opacity: 1
    },
    loaderLeaveActive: {
        opacity: 0.01,
        transition: 'opacity 200ms ease-in'
    },
    loaderAppear: {
        opacity: 0.01
    },
    loaderAppearActive: {
        opacity: 1,
        transition: 'opacity 200ms ease-in'
    },
};