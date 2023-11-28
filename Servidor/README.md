# SERVIDOR UEFBC

## COMANDOS PARA INICIALIZAR EL PROYECTO

> **Nota:** solo en caso de un proyecto nuevo

1. Instale lo siguiente:

```shell
npm init -y # crea el archivo inicial de package.json
npm i typescript -D # soporte para typescript
npx tsc --init # crea el archivo inicial de tsconfig.json
npm install ts-node-dev -D # soporte para desarrollo en typescript
```

2. Modifique tsconfig.json

```json
"outDir": "./build",
```

3. Modifique tambien para excluir los archivos create y test

```json
"compilerOptions": {
},
"exclude": [
    "src/create.ts",
    "src/test.ts"
]
```

4. Modifique package.js
   > **Nota:** create.ts o npm run generate no ejecutar en este momento, solo era para cambios iniciales de la base de datos

```js
  "scripts": {
    "prestart": "tsc",
    "start": "node build/app.js",
    "generate": "ts-node-dev src/create.ts",
    "database": "ts-node-dev src/database.ts",
    "dev": "ts-node-dev src/app.ts",
    "test": "ts-node-dev src/test.ts"
  },
```

5. Instalaremos las dependencias de desarrollo

### DEPENDENCIAS DE DESARROLLO

```shell
npm i dotenv --save
npm i --save mysql2
npm i --save-dev @types/node
npm i express
npm i --save-dev @types/express
npm i uuid
npm i --save-dev @types/uuid
npm install crypto-js
npm i --save-dev @types/crypto-js
npm install cors
npm i --save-dev @types/cors
npm i --save-dev --save-exact prettier

```

## COMANDOS PARA COMPILAR EL PROYECTO

```shell
npm start # para produccion
npm run dev # para desarrollo
npm run testdev # para testeo en consola

```
