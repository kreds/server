# kreds/server

node.js (routing-controllers and koa) [Kreds](https://github.com/kreds/api) server.

**Not production ready, database migrations won't be created until I consider the schema to be somewhat stable.**

Progress towards reaching the first goal: **0%**.

## Project goals:

- [ ] OAuth 2.0 support.
- [ ] OpenID support.
- [ ] Third-party login support.
- [ ] SAML support.

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
