# itwin-viewer-ts

## Goals

Create an iTwin Viewer from scratch using [iTwin.js](https://www.itwinjs.org/).

- [ ] [View an iModel](#chapter-1-view-an-imodel)
  - [ ] [Connect to an iModel](#part-1-connect-to-an-imodel)
  - [ ] [Display the iModel](#part-2-display-the-imodel)
- [ ] View properties of an iModel
- [ ] View a Reality Model

## Instructions

Bootstrapped with [Vite](https://vite.dev/guide/#scaffolding-your-first-vite-project)

```
pnpm create vite itwin-viewer-ts --template vanilla-ts
```

We will be using [pnpm](https://pnpm.io/) as our package manager, preferred way to install it is via [corepack](https://pnpm.io/installation#using-corepack).

```
corepack enable pnpm
```

We want to make sure we are explicit with our dependencies, so we will disable auto installation of peer dependencies. Modify the [.npmrc](.npmrc) to include the following:

```
auto-install-peers=false
```

### Chapter 1: View an iModel

#### Part 0. Config

1. Install [@itwin/core-frontend](https://www.npmjs.com/package/@itwin/core-frontend) and all of it's [peer dependencies](https://github.com/iTwin/itwinjs-core/blob/master/core/frontend/package.json#L47).

```
pnpm add @itwin/core-frontend @itwin/core-bentley @itwin/core-geometry @itwin/core-common @itwin/core-orbitgt @itwin/core-quantity @itwin/appui-abstract
```

2. Install [vite-plugin-static-copy](https://www.npmjs.com/package/vite-plugin-static-copy) to copy all static assets (worker scripts, icons, i18n files, etc) from iTwin.js dependencies.

```
pnpm add vite-plugin-static-copy
```

3. Update your [vite.config](vite.config.mts) to include the above plugin and set the [envPrefix](https://vite.dev/config/shared-options.html#envprefix) to `IMJS_`.

4. Fill out the `.env` file with the following:

```

IMJS_ITWIN_ID = "{YOUR_ITWIN_ID}"
IMJS_IMODEL_ID = "{YOUR_IMODEL_ID}"

# Go to https://viewer.itwin.dev, click on the kebab menu in the top right and copy the access token

IMJS_ACCESS_TOKEN = "{YOUR_ACCESS_TOKEN}"

```

#### Part 1. Connect to an iModel

1. Create an instance of an [IModelConnection](https://www.itwinjs.org/learning/frontend/imodelconnection/), specifically a [CheckpointConnection](https://www.itwinjs.org/reference/core-frontend/imodelconnection/checkpointconnection/) for a `read-only` connection to an iModel on a remote backend.
2. This will complain about [missing implementation of IModelApp.hubAccess](https://github.com/iTwin/itwinjs-core/blob/master/core/frontend/src/CheckpointConnection.ts#L52), so let's implement it.
3. We will need to initialize [IModelApp](https://www.itwinjs.org/learning/frontend/imodelapp/) which is a [Singleton](https://www.patterns.dev/vanilla/singleton-pattern/) responsible for managing the lifecycle, state, and configuration of the frontend application.
4. Provide an instance of [FontendHubAccess](https://www.itwinjs.org/reference/core-frontend/hubaccess/frontendhubaccess/) to IModelApp via [IModelAppOptions](https://www.itwinjs.org/reference/core-frontend/imodelapp/imodelappoptions/). Our recommended default implementation is `FrontendIModelsAccess` from the [@itwin/imodels-access-frontend](https://www.npmjs.com/package/@itwin/imodels-access-frontend) package, which provides an HTTP Client for the iTwin Platform's [iModel's API](https://developer.bentley.com/apis/imodels-v2/overview/)
5. You will now see an error about an unsupported access token format, because we haven't provided a way to authenticate to the [iTwin Platform](https://developer.bentley.com/). You will need to provide IModelApp with an instance of an [AuthorizationClient](https://www.itwinjs.org/reference/core-common/authorization/authorizationclient/). For our simple demo, we will create an object that returns the access token from our `.env` file.
6. After supplying an authorization client, you'll see your requests to the iModels APIs now succeed, but a new error in the console about some RPC interface not being initialized. iTwin.js uses [RPC](https://www.itwinjs.org/learning/rpcinterface/) to communicate with an iModel Backend, or in our case the remote backend aka [Visualization service](https://developer.bentley.com/api-groups/visualization/). We setup the RPC system by initializing the [RpcManager](https://www.itwinjs.org/reference/core-common/rpcinterface/bentleycloudrpcmanager/) with the required RpcInterfaces.
7. Now after all this, you will have successfully connected to an iModel from the Web

#### Part 2. Display the iModel

1.  A `View` renders geometry from one or more Models of an iModel in a web browser. iTwin.js applications can embed and interact with Views anywhere on a web page via an `HTMLDivElement`. Views are managed by the [ViewManager](https://www.itwinjs.org/reference/core-frontend/views/viewmanager) class, using [IModelApp.viewManager](https://www.itwinjs.org/reference/core-frontend/imodelapp/imodelapp/#viewmanager). The `Viewport` class is responsible for displaying a View, as defined by its [ViewState](https://www.itwinjs.org/learning/frontend/views/#the-viewstate-class). To facilitate that, you need to connect the event system of the browser with Viewports via `IModelApp.viewManager`.
2.  Create an instance of a `ViewState` from [ViewCreator3d.createDefaultView](https://www.itwinjs.org/reference/core-frontend/views/viewcreator3d/createdefaultview/) and provide it to [ScreenViewport.create](https://www.itwinjs.org/reference/core-frontend/views/screenviewport/createstatic/) to create the [Viewport](https://www.itwinjs.org/reference/core-frontend/views/screenviewport/) and add it to the the `ViewManager`.
3.  You'll see nothing gets rendered because we forgot to initialize the [IModelTileRpcInterface](https://www.itwinjs.org/reference/core-common/rpcinterface/imodeltilerpcinterface/) which is responsible for fetching the tiles from the backend. Once we add that to the list of RpcInterfaces, you'll see the iModel rendered in the browser.
4.  Congratulation, you have successfully built an iTwin viewer that displays an iModel!
