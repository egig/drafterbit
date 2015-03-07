<?php return [

/**
 *--------------------------------------------------------------------------
 * Service Providers and Each Provided Services
 *--------------------------------------------------------------------------
 *
 * we need to create list of providers along with the provided services.
 * This is really necessarry for lazy loading for each service.
 */
    'Drafterbit\\App\\Provider\\ImageServiceProvider'    => ['image'],
    'Drafterbit\\App\\Provider\\TwigServiceProvider'     => ['twig'],
    'Drafterbit\\App\\Provider\\ThemeServiceProvider'    => ['themes'],
    'Drafterbit\\App\\Provider\\MailServiceProvider'     => ['mailer', 'mail'],
];