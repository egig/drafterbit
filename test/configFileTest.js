

module.exports = {
    "DEBUG": true,
    "PORT": 3000,
    "SESSION_SECRET": "secr3t",
    "DOCS_VERSION": "1.0",
    "DOCS_TITLE": "Drafterbit API",
    "REDIS_HOST": "localhost",
    "REDIS_PORT": 6379,
    "REDIS_DB": 0,
    "MAILJET_APIKEY_PUBLIC": "",
    "MAILJET_APIKEY_PRIVATE": "",
    "MONGODB_PROTOCOL": "mongodb",
    "MONGODB_URL": "",
    "MONGODB_NAME": "test_db_name",
    "MONGODB_HOST": "localhost",
    "MONGODB_PORT": "27017",
    "MONGODB_USER": "",
    "MONGODB_PASS": "",
    "ADMIN_API_KEY": "test",
    "project_id": "localpro",
    "modules": [
        './src/modules/content',
    ],
    "admin.user_api_base_url": "http://localhost:8000",
    "admin.user_api_key": "testapikey",
    "admin.api_base_url": "http://localhost:3000",
    "admin.api_key": "test"
}