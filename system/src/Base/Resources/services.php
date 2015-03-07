<?php return [

    'Drafterbit\\Base\\Provider\\HelperServiceProvider',
    'Drafterbit\\Base\\Provider\\BuilderServiceProvider',
    'Drafterbit\\Base\\Provider\\ConfigServiceProvider',
    'Drafterbit\\Base\\Provider\\DispatcherServiceProvider',
    'Drafterbit\\Base\\Provider\\RoutingServiceProvider',
    'Drafterbit\\Base\\Provider\\InputServiceProvider',
    'Drafterbit\\Base\\Provider\\EncryptionServiceProvider',
    'Drafterbit\\Base\\Provider\\CookieServiceProvider',
    'Drafterbit\\Base\\Provider\\SessionServiceProvider',
    'Drafterbit\\Base\\Provider\\LogServiceProvider',
    'Drafterbit\\Base\\Provider\\TranslationServiceProvider',

    'Drafterbit\\Base\\Provider\\TimeServiceProvider'       => ['time'],
    'Drafterbit\\Base\\Provider\\CacheServiceProvider'      => ['cache'],
    'Drafterbit\\Base\\Provider\\DatabaseServiceProvider'   => ['db'],
    'Drafterbit\\Base\\Provider\\MigrationServiceProvider'  => ['migrator'],
    'Drafterbit\\Base\\Provider\\LanguageServiceProvider'   => ['lang'],
    'Drafterbit\\Base\\Provider\\TemplateServiceProvider'   => ['template'],
    'Drafterbit\\Base\\Provider\\AssetServiceProvider'      => ['asset'],
    'Drafterbit\\Base\\Provider\\ValidationServiceProvider' => ['validator', 'validation.form'],
];