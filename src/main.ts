import { AuthorizationClient, BentleyCloudRpcManager, IModelReadRpcInterface, IModelTileRpcInterface } from "@itwin/core-common";
import { CheckpointConnection, IModelApp, ScreenViewport, StandardViewId, ViewCreator3d } from "@itwin/core-frontend";
import { FrontendIModelsAccess } from "@itwin/imodels-access-frontend";
import "./style.css";

// Get the environment variables, all prefixed with IMJS_
// Your vite.config.* should have set https://vite.dev/config/shared-options.html#envprefix
const { IMJS_ITWIN_ID, IMJS_IMODEL_ID, IMJS_ACCESS_TOKEN } = import.meta.env;

const authorizationClient: AuthorizationClient = {
  getAccessToken: async () => IMJS_ACCESS_TOKEN,
};

const rpcInterfaces = [IModelReadRpcInterface, IModelTileRpcInterface];

BentleyCloudRpcManager.initializeClient(
  {
    uriPrefix: "https://api.bentley.com", // iTwin Platform base URL
    info: { title: "imodel/rpc", version: "v4" }, // endpoint for the [Visualiztion service](https://developer.bentley.com/api-groups/visualization/)
  },
  rpcInterfaces
);

await IModelApp.startup({
  hubAccess: new FrontendIModelsAccess(),
  authorizationClient,
});

// Create a `read-only` connection to an iModel on a remote backend.
const iModelConnection = await CheckpointConnection.openRemote(
  IMJS_ITWIN_ID,
  IMJS_IMODEL_ID
);
console.log(iModelConnection);

const root = document.querySelector<HTMLDivElement>("#app")!;

// obtain a viewState for the model and add it to a Viewport within the container
const viewCreator = new ViewCreator3d(iModelConnection);
const view = await viewCreator.createDefaultView();
const vp = ScreenViewport.create(root, view);
IModelApp.viewManager.addViewport(vp);