<div style="align:center;"><img src="public/icon.png" alt="logo icon"></div>

# Rocket.Chat-URL_Shortener

**Rocket.Chat App which:**

- shortens URLs with public APIs _(which do not require authentication)_
- shortens URLs with public APIs _(which provide an access token)_
- custom configured using a url _(which redirects to the app's public endpoint for the actual url)_

# Development

## Setting up the Development Environment

Make sure you have the [rc-apps engine CLI](https://github.com/RocketChat/Rocket.Chat.Apps-cli) installed.

You can install it using

```sh
npm install -g @rocket.chat/apps-cli # install
rc-apps -v # check if installed and the version
```

## File and Folder Structure

### Dependencies

The **main** dependencies of the Rocket.Chat app are those mentioned in the `devDependencies` inside [package.json](./package.json)

### Lint Style

The project uses [ESLint AirBnB Base](https://www.npmjs.com/package/eslint-config-airbnb-base) for linting the source code.

You can run `npm run lint` to check your linting and `npm run lintf` to **autocorrect** your linting.
