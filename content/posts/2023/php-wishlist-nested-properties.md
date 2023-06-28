---
title: "PHP wishlist: Nested properties"
slug: php-wishlist-nested-properties
date: 2023-06-27T10:30:00+02:00
tags:
  - PHP
  - PHP Wishlist
---

Next on my [PHP wishlist](/tags/php-wishlist) are nested properties. This idea is less realistic than others, it's more me thinking out loud. I don't have a good syntax proposal for this, and I'm not even sure it's the best solution for my problem. But it's the best I've come up with so far.

<!--more-->

When I want a typed object, I need to create a class in a new file, and give it a name. (While technically not required, one class per file is highly recommended to work well with tools and IDEs we have to our disposal.)

It's too expensive to add types in PHP.

As an example, let's build a headless CRM. We'll start with a `ContactResource` class. A `Resource` class is a JSON-serializable class that can be used in an API response. It can be created from an entity or model.

```php
class ContactResource extends Resource
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
    ) {
    }

    public static function fromContact(Contact $contact): self
    {
        return new self(
            id: $contact->id,
            name: $contact->name,
            email: $contact->email,
        );
    }
}
```

In addition to the contact's attributes, I want to add a list of related endpoints to exposed through the API. While I could set an associative array, I prefer types because they're strict, explicit, support IDE autocompletion, and allow tools to process them with reflection.

I'll create a `ContactResourceEndpoints` class and file, and add it as a property to `ContactResource`

```php
// ContactResourceEndpoints.php
class ContactResourceEndpoints
{
    public function __construct(
        public string $index,
        public string $store,
        public string $update,
        public string $delete,
    ) {
    }
}

// ContactResource.php
class ContactResource extends Resource
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public ContactResourceEndpoints $endpoints,
    ) {
    }

    public static function fromContact(Contact $contact): self
    {
        return new self(
            id: $contact->id,
            name: $contact->name,
            email: $contact->email,
            endpoints: new ContactResourceEndpoints(
                index: action([ContactController::class, 'index']),
                store: action([ContactController::class, 'store']),
                update: action([ContactController::class, 'update'], $contact->id),
                update: action([ContactController::class, 'delete'], $delete->id),
            ),
        );
    }
}
```

Having to maintain another file, in another place, with another name adds a lot of friction. This pushes developers to use less types (by using an assiative array) or worse: create the wrong abstraction (`abstract class Endpoints` is _not_ a good use of inheritence).

More downsides:

- `ContactResourceEndpoints` isn't meant to be used anywhere else, so it doesn't warrant its own name or class.
- Looking at the constructor, it's not clear which properties are in `ContactResource`, I need to click through to a deeper class to get all the information.
- We could inline the properties on `ContactResource`, but besides looking messy it can cause clashes.

In TypeScript, these tradeoffs don't exist as you can nest objects in your type declarations.

```ts
type ContactResource = {
  id: string;
  name: string;
  email: string;
  endpoints: {
    index: string;
    store: string;
    update: string;
    delete: string;
  };
}
```

I'd love to see something similar in PHP.

```php
class ContactResource extends Resource
{
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public $endpoints: (
          string $index,
          string $store,
          string $update,
          string $delete,
        ),
    ) {
    }

    public static function fromContact(Contact $contact): self
    {
        return new self(
            id: $contact->id,
            name: $contact->name,
            email: $contact->email,
            endpoints: (
                index: action([ContactController::class, 'index']),
                store: action([ContactController::class, 'store']),
                update: action([ContactController::class, 'update'], $contact->id),
                delete: action([ContactController::class, 'delete'], $delete->id),
            ),
        );
    }
}
```

Removing the need for another file makes it cheaper to add proper types to your objects. Nested properties are also "anonymous" as they don't have a name, which restricts them to be reused.

This is not an RFC, and there's a fair chance this syntax will clash with another PHP feature. But bear with me; this is just an idea I'm throwing on the table. I'd love to hear other viewpoints!

---

More on my PHP wishlist:

- [The pipe operator](/php-wishlist-pipe-operator)
- Nested properties
