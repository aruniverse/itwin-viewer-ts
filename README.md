# itwin-viewer-ts

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
