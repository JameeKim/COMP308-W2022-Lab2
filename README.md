# Lab Assignment #2

> Designing and implementing a complete web app using MERN stack

## Project Structure

This project uses [npm workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces). The following part in `./package.json` defines the workspaces:

```json
{
  "workspaces": [
    "common",
    "client",
    "server"
  ]
}
```

The following shows a graphical representation of the project structure.

```txt
/
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── common/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── server/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── tsconfig.json
```

### `common` package

The `common` package is a dependency for both `client` and `server` packages. It mostly contains type declarations of shared data models, such as students and courses, and validation methods for the models and their fields.

### `server` package

This is the server-side express application that handles API calls and also serves the generated static files when in the production environment.

### `client` package

The `client` package is the client-side (web browser) part of the project. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to Run

**VERY IMPORTANT**; BEFORE YOU TRY TO RUN THIS:

You need to copy the `.env` file at the project root directory and make a new file called `.env.local` in the same directory. The values need to be inserted for each field. If you don't do this, the backend application won't run at all.

### npm commands

- `npm run dev:server`: Run watchers for the server package for development (watches for the common package, too)
- `npm run dev:client`: Run the dev server for the react client package
- `npm run build`: Build production files for all packages
- `npm start`: Start the backend express server in production mode from the built files (not for development)
