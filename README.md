<div style="align:center;"><img src="public/icon.png" alt="logo icon"></div>

# Rocket.Chat-URL_Shortener

### Features

- **zero configuration option** (just select the provider from the dropdown)
- **custom configuration option** (for shorteners which require authentication ex. bitly)
- **url statistics** (the stats for the shortened url) _IN BETA STAGE_
- **domain url configuration option** (IN APP shortener by redirecting to the app's endpoint)
- **ui buttons** (buttons like `send to chat`) _IN BETA STAGE_ 
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
