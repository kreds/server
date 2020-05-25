# kreds/server

node.js (routing-controllers and koa) [Kreds](https://github.com/kreds/api) server.

**Do not use this in production yet.**

## Testing

Kreds is not yet ready for a production deployment. The server can be prepared for testing by running the following commands:

```
yarn install
yarn database:seed
yarn dev
```

A default `admin` user (password: `admin`) is created with all permissions (the user is in the Superuser group).

## Personal information processed/stored by the software:

This should be disclosed within the privacy policy of each given deployment:

- IP address
- E-mail address
- Full name
- Custom user attributes

All of these depend on settings used by a given instance.
