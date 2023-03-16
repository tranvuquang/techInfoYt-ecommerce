// create server
npm init

// add typescript
$ yarn add -D typescript @types/node

// copy file tsconfig.json

// install nodemon

add packege.json

"scripts": {
...,
"start": "node dist/index.js",
"server": "nodemon dist/index.js",
"watch": "tsc -w"
},

chay 2 terminal yarn watch yarn server ==> OK

npm i --save-dev @types/express dotenv
