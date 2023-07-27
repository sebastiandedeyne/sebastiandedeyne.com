<?php

return [
    'feeds' => [
        'main' => [
            'items' => [\App\Feed::class, 'all'],
            'url' => '/index.xml',
            'title' => 'Sebastian De Deyne',
            'description' => 'I\'m a web developer and designer. I build websites & interfaces with JavaScript, CSS and PHP.',
            'language' => 'en-US',
            'image' => 'https://sebastiandedeyne.com/media/me.jpg',
            'format' => 'atom',
            'view' => 'feed::atom',
            'type' => '',
            'contentType' => '',
        ],
        'articles' => [
            'items' => [\App\Feed::class, 'articles'],
            'url' => '/articles.xml',
            'title' => 'Sebastian De Deyne: Articles',
            'description' => 'I\'m a web developer and designer. I build websites & interfaces with JavaScript, CSS and PHP.',
            'language' => 'en-US',
            'image' => 'https://sebastiandedeyne.com/media/me.jpg',
            'format' => 'atom',
            'view' => 'feed::atom',
            'type' => '',
            'contentType' => '',
        ],
    ],
];
