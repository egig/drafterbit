module.exports = {
    'API_BASE_URL': '/',
    'API_KEY': '',
    'PORT': 3000,
    'SESSION_SECRET': 'secr3t',
    'MONGODB_URI': 'mongodb://localhost:27017/dt?retryWrites=true&w=majority',
    'modules': [
        // content should go last
        './drafterbit/modules/auth',
        './drafterbit/modules/common',
        './drafterbit/modules/admin',
        './drafterbit/modules/content',
    ]
};