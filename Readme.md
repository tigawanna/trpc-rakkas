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
pnpm install @trpc/client @trpc/react-query @trpc/server superjson zod
```

**prisma**

This one is optional as tprc doesn't necesarily need it , but we're trying to recreate the t3-stack which in Nextjs in vite + react , you can use whatever javascript orm / data source

```sh
pnpm install prisma
```

### Rakkasjs basics

What is [rakkasjs](https://rakkasjs.org/guide/what-is-rakkas)? , The closest thing to a Nextjs on vite .


To get started we'll create the trpc api endpoint which will be a catch all route with the `all` verb .

To create api routes in rakkas we put it in the  `src/routes/api` directory , simple api route would look something like this 

```ts
// src/routes/api/index.api.ts
import { json } from "@hattip/response";
import { StatusCodes } from "http-status-codes";
import { RequestContext } from "rakkasjs";

export async function get(ctx: RequestContext) {
try {
    return json({ message: "welcome to rakkas root api" },{ status: StatusCodes.ACCEPTED });
    } catch (error) {
    return json(error, { status: StatusCodes.BAD_REQUEST });    }
}

export async function post(ctx: RequestContext) {
    const body = await ctx.request.json();
    try {
        return json({body },{ status: StatusCodes.ACCEPTED });
    } catch (error) {
        return json(error,{ status: StatusCodes.BAD_REQUEST });
    }
}

```
we're going to be doing alot of relative imports so let's setup tsconfig aliases to point `@/` to `src/`

```json

{
  "compilerOptions": {
    "target": "es2020",
    "module": "ESNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "types": ["vite/client"],

   
   "paths": {
      "@/*": ["src/*"]
    }



  }
}

```


Our trpc catch all route
```ts
// src/routes/api/trpc/[...trpc].api.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { RequestContext } from 'rakkasjs';
import { createTRPCContext } from '@/server/trpc';
import { appRouter } from '@/server/routes/root';

export async function all(ctx: RequestContext){
    return fetchRequestHandler({
        endpoint: '/api/trpc',
        req: ctx.request,
        router: appRouter,
        createContext:createTRPCContext,
    });
}
```
The only difference between this and the nextjs `create-t3-app` is that we're using the `fetchRequestHandler` instead of the nextjs adapter 

hattip like most of the other agnostic runtime servers relies on the standard fetch API.

### trpc setup
We'll put all the trpc logic in the `src/server` directory

first we'll create the trpc context
```ts
export function createTRPCContext({ req, resHeaders }: FetchCreateContextFnOptions) {
  const user = { name: req.headers.get('username') ?? 'anonymous' };
  // return createInnerTRPCContext({});
  return { req, resHeaders, user, prisma };
}

```

then we init trps
```ts
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
```

then we export the router and procedure

```ts
export const createTRPCRouter = t.router;
export const router = t.router
export const publicProcedure = t.procedure;
```

Then we can now create the trc router+ it's endpoints

```ts
// src/server/routes/root.ts
import { createTRPCRouter, publicProcedure } from '../trpc';
import { helloRouter } from './hello';
import { postRouter } from './posts';
import { userRouter } from './user';

//  to test using a REST API client use a . to access nested routes insteda of a slash
//ex: http://localhost:5173/api/trpc/welcome
//ex: http://localhost:5173/api/trpc/hello.wave

export const appRouter = createTRPCRouter({
  hello:helloRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

```

```ts
// src/server/routes/hello.ts
import { createTRPCRouter, publicProcedure } from "../trpc";
export const helloRouter = createTRPCRouter({
    hey: publicProcedure.query((opts) => {
        return `Hey there`;
    }),
    wave: publicProcedure.query(async(opts) => {
        return `🙋‍♀️`;
    }),

})
```
