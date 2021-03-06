# LARA Debugging Plugin

Add this plugin to a LARA instance to see what the plugin runtime context is being
set as. Future plans are to exercise all lara API functions.

This project was cloned from the [Lara Starter Plugin repo](https://github.com/concord-consortium/lara-starter-plugin).

A LARA Plugin API Interface has been provided in `./src/lara/interfaces.ts`. It would be smart to check the
[current LARA API](https://github.com/concord-consortium/lara/blob/master/app/assets/javascripts/lara-api.js) in the
[LARA repo](https://github.com/concord-consortium/lara)

To install this plugin in LARA using a local server, login as an admin, and follow
the top navigation link to 'Plugins' and then create a new one. Set the plugin's
label to `LaraDebugPlugin` as defined in `plugin-config.tsx`.

## Development

### Initial steps

1. Clone this repo and `cd` into it
2. Run `npm install` to pull dependencies
3. Run `npm start` to run `webpack-dev-server` in development mode with hot module replacement

### Building

If you want to build a local version run `npm build`, it will create the files in the `dist` folder.
You *do not* need to build to deploy the code, that is automatic.  See more info in the Deployment section below.

### Notes

1. Make sure if you are using Visual Studio Code that you use the workspace version of TypeScript.
   To ensure that you are open a TypeScript file in VSC and then click on the version number next to
   `TypeScript React` in the status bar and select 'Use Workspace Version' in the popup menu.

## Deployment

Production releases to S3 are based on the contents of the /dist folder and are built automatically by Travis
for each branch pushed to GitHub and each merge into production.

Merges into production are deployed to `https://lara-debug-plugin.concord.org`.

Other branches are deployed to `https://lara-debug-plugin.concord.org/branch/<branch-name>`.

You can view the status of all the branch deploys [here](https://travis-ci.com/github/concord-consortium/lara-debugging-plugin/branches).

To deploy a production release:

1. Increment version number in package.json
2. Create new entry in CHANGELOG.md
3. Run `git log --pretty=oneline --reverse <last release tag>...HEAD | grep '#' | grep -v Merge` and add contents (after edits if needed to CHANGELOG.md)
4. Run `npm run build`
5. Copy asset size markdown table from previous release and change sizes to match new sizes in `dist`
6. Create `release-<version>` branch and commit changes, push to GitHub, create PR and merge
7. Checkout master and pull
8. Checkout production
9. Run `git merge master --no-ff`
10. Push production to GitHub

### Testing

Run `npm test` to run jest tests. Run `npm run test:full` to run jest and Cypress tests.

## License

This LARA Plugin is Copyright 2018 (c) by the Concord Consortium and is distributed under the [MIT license](http://www.opensource.org/licenses/MIT).

See `LICENSE` for the complete license text.
