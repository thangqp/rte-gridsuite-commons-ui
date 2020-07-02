# commons-ui

Library for sharing GridSuite apps commons components

#### For developers
The commons-ui library  have a demo app in which you can call your components to test them. 
The `npm start` command install the library's dependencies then launches the demo app.

If you want to test your library integration with a consumer application my-app you have first 
to build commons-ui via `npm run build` then change the commons-ui dependency in  my-app's package.json from `@gridsuite/commons-ui:'^x.x.x'` 
to `@gridsuite/commons-ui:'file:../path/to/the/commons-ui'` then type `npm install` `npm start`.
