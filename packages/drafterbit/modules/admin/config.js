module.exports = {
    'API_BASE_URL': '/',
    'API_KEY': '',
    'PORT': 3000,
    'SESSION_SECRET': 'secr3t',
    'MONGODB_PROTOCOL': 'mongodb+srv',
    'MONGODB_URL': '',
    'MONGODB_NAME': '',
    'MONGODB_HOST': '',
    'MONGODB_PORT': '',
    'MONGODB_USER': '',
    'MONGODB_PASS': '',
    'modules': [
        // content should go last
        './drafterbit/modules/auth',
        './drafterbit/modules/common',
        './drafterbit/modules/admin',
        './drafterbit/modules/content',
    ]
};