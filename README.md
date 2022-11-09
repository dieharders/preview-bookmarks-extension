This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Preview Link Gallery

A Chrome Extension to view, navigate and preview bookmarks

## Where to find Webpack config

You can find all webpack config inside `node_modules/react-scripts/config`. Webpack configuration is being handled by react-scripts.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` and/or `dist` folder using custom bash script.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

See the section below about deploying your extension to Google Chrome.

## Deploy Chrome Extension

- Run `npm run build` in project directory.<br />
- Go to `chrome://extensions/` in browser.<br />
- Turn on `developer mode` at top right.<br />
- Click `Load unpacked` at left side and select your `dist` folder.<br />
- Then go to `chrome://bookmarks/` in browser to view your extension.<br />

## Deploy Server-less Functions

Follow these steps to add/deploy cloud functions using Netlify.

### Environment Vars

- Rename `example.env` to `.env` and fill out values.
- Be sure to deploy/mirror this file to Netlify.

### Build & Deployment on Netlify

- Under "Build and Deploy -> Continuous Deployment -> Build Settings"
- Set `Build command` to `CI= npm run build` spacing must be exact!!!
- Also make sure the env var `CI` is set to `false`

### Deploy functions to Netlify

To add/replace functions, simply add a commit and push to your repo. Any changes will now be reflected in your Netlify dashboard.

### Testing functions locally

- Run the command `npm run netlify dev`
- This serves a local instance of the front-end (configure path in `netlify.toml` under `publish`) and the server-less functions so the two can talk to each other on the correct ports.
