# Interactive semantic parsing client for robot control (NRC)

## Information
- The parser relies on [SEMPRE](https://github.com/percyliang/sempre) with modifications for actions and interaction in [Sida Wang's fork](https://github.com/sidaw/sempre-interactive). The parser additionally relies on further modifications for adaptations to a specific robot control environment in [my fork](https://github.com/The-Dawwctor/sempre-robot).

## Developer Instructions

#### Installation

Make sure you have yarn installed. Follow the instruction at https://yarnpkg.com/lang/en/docs/install/

Additionally, run the following command
    sudo apt-get install nodejs

To install, simply run `yarn install`. This will install all the needed node dependencies.

#### Development

We use [react-scripts]([https://github.com/facebookincubator/create-react-app]) to handle the building and running of the client.

To run locally with hot reload, run `yarn start`.

By default, the client tries to connect to the servers specified in "constants/strings.js". But, if you wish the client to connect to a different instance of SEMPRE or the community server, you can set environment variables to override the URLs they try to connect. The following environmental variables will tell the client which server to connect to:

- `REACT_APP_SEMPRE_SERVER` specifies the URL of the running SEMPRE instance.

You can either specify these in a `.env` file or in the CLI command like so, `REACT_APP_SEMPRE_SERVER=localhost:8410 yarn start`

#### Building

Run `yarn build` to build a production version of the app. The build will be saved to "/build".

*Note:* In order to build to deploy to a URL that is not the root, you must [set the "homepage" in "package.json" to the URL where the client will be hosted](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#building-for-relative-paths).

#### Deployment

It is simple to deploy to Github Pages. Just set the "homepage" variable in "package.json", and then run `yarn deploy`.

## Important Note
If you are unable to input commands into the command line and send them succesfully, you will have to enable unsafe scripts on your web browser for the javascript to work.

## Organization

All javascript and CSS source code is the "src" folder. Generally, anything that is a route is in "src/routes". Anything that is not a route, but that handles interacts directly with data in the store (i.e. is wrapped with Redux's connect function) is in "src/containers". Anything that does not get data directly from the store will reside in "src/components".

The setting (BlocksWorld) lives in the "src/setting". Here is the only logic that is blocks world dependent for the robot world representation.

### Build Your Own Setting!

Interested in expanding this client to handle a different setting? Everything should be setting agnostic except for the code in "src/setting". All you have to do is implement all the same props as "src/setting/BlocksWorld" does and then export the new setting as the App's setting by changing what gets imported in "src/setting/index.js". Then, everything should work as intended!