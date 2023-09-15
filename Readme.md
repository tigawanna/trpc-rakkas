# TRPC + VITE + REACT 

## Setup using [Rakkasjs](https://rakkasjs.org/guide/what-is-rakkas)

### 1. inititizize the project

```sh
pnpm create rakkas-app my-rakkas-app
```
install the other dependancies 

**hattip**

what is [hattip](https://github.com/hattipjs/hattip)? ,
it's what powers the backend for Rakkasjs , allows you to write code that'll run in multiple runtimes and environments , like node,bun ,deno ,cloudflare workers ... 

```sh
pnpm install hattip @hattip/response @hattip/cookie http-status-codes
```

**trpc**

What is [trpc](https://trpc.io/docs)? , An esy way to write typesafe apis in typescript , collocated backend and frontend share types and give you a typesafe RPC API

```sh
pnpm install @trpc/client @trpc/react-query @trpc/server
```

**prisma**

This one is optional as tprc doesn't necesarily need it , but we're trying to recreate the t3-stack which in Nextjs in vite + react , you can use whatever javascript orm / data source

```sh
pnpm install prisma
```

### Rakkasjs basics

What is [rakkasjs](https://rakkasjs.org/guide/what-is-rakkas)? , The closest thing to a Nextjs on vite .


To get started we'll create the trpc api endpoint which will be a catch all route with the `all` verb .

To create api routes in rakkas we put it in the  `src/routes/api` directory , norlmal api route would look something like this 
