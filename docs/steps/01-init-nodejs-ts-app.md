## 01 Create Typescript Nodejs App

- https://phillcode.io/nodejs-console-app-with-typescript-linting-and-testing

- Init Typescript Nodejs App

```sh
mkdir webapp && cd $_
npm init -y
npm install typescript ts-node ts-node-dev rimraf @types/node -D
```

- Add the `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- Edit `package.json`

```json
"scripts": {
  "build": "rimraf dist && tsc",
  "dev": "ts-node-dev --respawn ./src/index.ts",
  "start": "ts-node ./src/index.ts"
},
```

- Add some starter code

Create `src/getGreeting.ts` with:

```ts
export function getGreeting(name: string): string {
  return `Hello, ${name}!`;
}
```

Create `src/index.ts with`:


```ts
import { getGreeting } from "./getGreeting";

const greeting = getGreeting("John");
console.log(greeting);
```

- `.gitignore`

```
node_modules
dist
.env

```