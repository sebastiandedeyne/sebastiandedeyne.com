<?php

return [
    /*
     * This is the class responsible for providing the URLs which must be redirected.
     * The only requirement for the redirector is that it needs to implement the
     * `Spatie\MissingPageRedirector\Redirector\Redirector`-interface
     */
    'redirector' => \Spatie\MissingPageRedirector\Redirector\ConfigurationRedirector::class,

    /*
     * By default the package will only redirect 404s. If you want to redirect on other
     * response codes, just add them to the array. Leave the array empty to redirect
     * always no matter what the response code.
     */
    'redirect_status_codes' => [
        \Symfony\Component\HttpFoundation\Response::HTTP_NOT_FOUND,
    ],

    /*
     * When using the `ConfigurationRedirector` you can specify the redirects in this array.
     * You can use Laravel's route parameters here.
     */
    'redirects' => [
        '/feed' => '/index.xml',
        '/feed/articles' => '/articles.xml',
        '/posts/index.xml' => '/articles.xml',
        '/articles/index.xml' => '/articles.xml',
        '/2016/{slug}' => '/{slug}',
        '/2017/{slug}' => '/{slug}',
        '/2018/{slug}' => '/{slug}',
        '/posts/2016/{slug}' => '/{slug}',
        '/posts/2017/{slug}' => '/{slug}',
        '/posts/2018/{slug}' => '/{slug}',
        '/semver-deps' => '/composer-semver-and-underlying-dependency-changes',
        '/javascript-framework-diet/{slug}' => '/javascript-framework-diet-{slug}',
        '/vite-with-laravel/{slug}' => '/vite-with-laravel-{slug}',
        '/unix-things/{slug}' => '/{slug}',
        '/event-sourcing/{slug}' => '/{slug}',
        '/a-blog-post-is-a-very-long-and-complex-search-query' => '/links/a-blog-post-is-a-very-long-and-complex-search-query',
        '/css-custom-properties-to-customize-mailcoach' => '/links/css-custom-properties-to-customize-mailcoach',
        '/event-sourcing-on-php-annotated' => '/links/event-sourcing-on-php-annotated',
        '/read-only-web-apps' => '/links/read-only-web-apps',
        '/pretend-everyone-costs-1k-hr' => '/links/pretend-everyone-costs-1k-hr',
        '/mathias-verraes-standards' => '/links/mathias-verraes-standards',
        '/the-grug-brained-developer' => '/links/the-grug-brained-developer',
        '/svelte-using-typescript-without-compilation' => '/links/svelte-using-typescript-without-compilation',
        '/jason-fried-delegating-projects-not-tasks' => '/links/jason-fried-delegating-projects-not-tasks',
        '/clean-code-has-room-to-breath' => '/links/clean-code-has-room-to-breath',
        '/fighting-inter-component-html-bloat' => '/links/fighting-inter-component-html-bloat',
        '/rethinking-reactivity' => '/links/rethinking-reactivity',
        '/ship-small-ship-fast' => '/links/ship-small-ship-fast',
        '/new-website-set-studio' => '/links/new-website-set-studio',
        '/robin-rendle-tech-last' => '/links/robin-rendle-tech-last',
        '/preemptive-pluralization' => '/links/preemptive-pluralization',
        '/customizing-spatie-packages' => '/links/customizing-spatie-packages',
        '/rauno-web-interface-guidelines' => '/links/rauno-web-interface-guidelines',
        '/deterministic-bliss-in-static-methods' => '/links/deterministic-bliss-in-static-methods',
        '/nat-eliason-good-ideas' => '/links/nat-eliason-good-ideas',
        '/css-states-with-attribute-selectors' => '/links/css-states-with-attribute-selectors',
        '/reusable-alpine-components-by-ryan-chandler' => '/links/reusable-alpine-components-by-ryan-chandler',
        '/clearing-inactive-accounts-personal-data' => '/links/clearing-inactive-accounts-personal-data',
        '/tim-macdonald-has-one-relationship' => '/links/tim-macdonald-has-one-relationship',
        '/antilibrary' => '/links/antilibrary',
        '/self-deprecating-comments' => '/links/self-deprecating-comments',
        '/the-complexity-that-lives-in-the-gui' => '/links/the-complexity-that-lives-in-the-gui',
        '/blurhash' => '/links/blurhash',
        '/options-not-roadmaps' => '/links/options-not-roadmaps',
        '/why-do-we-interface' => '/links/why-do-we-interface',
        '/dont-get-stuck' => '/links/dont-get-stuck',
        '/a-tale-of-client-side-framework-performance' => '/links/a-tale-of-client-side-framework-performance',
        '/builders-and-architects' => '/links/builders-and-architects',
        '/complexity-has-to-live-somewhere' => '/links/complexity-has-to-live-somewhere',
        '/gary-bernhardt-on-tests-and-typescript' => '/links/gary-bernhardt-on-tests-and-typescript',
        '/privacy-and-having-nothing-to-hide' => '/links/privacy-and-having-nothing-to-hide',
        '/give-it-five-minutes' => '/links/give-it-five-minutes',
        '/what-are-the-react-team-principles' => '/links/what-are-the-react-team-principles',
        '/the-rising-complexity-of-jamstack-sites' => '/links/the-rising-complexity-of-jamstack-sites',
        '/important-ideas-come-back' => '/links/important-ideas-come-back',
        '/the-rule-of-least-power' => '/links/the-rule-of-least-power',
        '/akins-laws-of-spacecraft-design' => '/links/akins-laws-of-spacecraft-design',
        '/materials-and-tools' => '/links/materials-and-tools',
        '/takuya-matsuyamas-take-on-growth' => '/links/takuya-matsuyamas-take-on-growth',
        '/reacts-versioning-policy' => '/links/reacts-versioning-policy',
        '/live-updating-oh-dear-status-pages-livewire-edition-with-caleb-porzio' => '/links/live-updating-oh-dear-status-pages-livewire-edition-with-caleb-porzio',
        '/fast-software-the-best-software' => '/links/fast-software-the-best-software',
        '/full-stack-radio-114-react-for-vue-developers' => '/links/full-stack-radio-114-react-for-vue-developers',
        '/understand-react-hooks-internals-with-a-28-line-react-clone' => '/links/understand-react-hooks-internals-with-a-28-line-react-clone',
        '/the-great-divide' => '/links/the-great-divide',
        '/an-introduction-to-phoenix-liveview' => '/links/an-introduction-to-phoenix-liveview',
        '/everyone-has-javascript-right' => '/links/everyone-has-javascript-right',
        '/not-all-code-is-the-same' => '/links/not-all-code-is-the-same',
        '/ia-writer-5.2-will-embrace-variable-fonts' => '/links/ia-writer-5.2-will-embrace-variable-fonts',
        '/a-blogging-style-guide' => '/links/a-blogging-style-guide',
        '/b%C3%A9zier-moi' => '/links/b%C3%A9zier-moi',
        '/chris-ferdinandis-css-methodology' => '/links/chris-ferdinandis-css-methodology',
        '/design-details-incremental-correctness-with-guillermo-rauch' => '/links/design-details-incremental-correctness-with-guillermo-rauch',
        '/christoph-rumpel-on-rebuilding-his-site-with-laravel' => '/links/christoph-rumpel-on-rebuilding-his-site-with-laravel',
        '/diving-into-requestanimationframe-with-benjamin-de-cock' => '/links/diving-into-requestanimationframe-with-benjamin-de-cock',
        '/introducing-our-company-guidelines-site' => '/links/introducing-our-company-guidelines-site',
        '/is-snapshot-testing-viable-in-php' => '/links/is-snapshot-testing-viable-in-php',
        '/fragmentation-is-fabulous' => '/links/fragmentation-is-fabulous',
    ],

];
