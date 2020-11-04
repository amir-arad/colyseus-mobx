# colyseus-mobx

a mobx view of colyseus state. continues the work in https://github.com/a-rts/colyseus-mobx

## version support 

Written for Mobx 5.x, but should probably work with other Mobx versions.

Due to breaking API changes in Colyseus, this version only supports Colyseus 0.14 and above (@colyseus/schema >= 1.0.2)

## Pending support

The schema types new to Colyseus 0.14 (CollectionSchema and SetSchema) are not yet supported. please open an issue if you would like to use them.

## Installation
`npm install colyseus-mobx --save`

## How to use
Import `getMobxView` and call it once when connecting to a room on the client side, 
```typescript
import { getMobxView } from 'colyseus-mobx';
const room: Room<GameState> = await client.joinOrCreate("game");
const mobxState = getMobxView(room.state);
```
then you can wire observers to `mobxState` and start rendering.

## Developer instructions

### Installing workspace

to install a development environment, you need to have node.js git installd.
Then, `git clone` this repo locally and run:
```
$ npm install
$ npm test
```
and that's it, you've just installed the development environment!

This project is written with [VSCode](https://code.visualstudio.com/) in mind. specifically configured for these extensions: [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

### test

`npm run test`

execute all tests.

### clean

`npm run clean`

Removes any built code and any built executables.

### build

`npm run build`

Cleans, then builds the library.

Your built code will be in the `./dist/` directory.
