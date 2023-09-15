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
  return { req, resHeaders, user };
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
With thhat done , our endppoints are ready to consume on the frontend

lets add some frontend dependancies

```sh
pnpm install @tanstack/react-query react-toastify
```
Then we configure the trpc client in  `src/utils/trpc.ts`

```ts
// src/utils/trpc.ts
import type { AppRouter } from '@/server/routes/root';
import { createTRPCReact } from '@trpc/react-query';


export const trpc = createTRPCReact<AppRouter>();

```
Then we creaet a trpc client for the provider

```ts
// src/utils/client.ts
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";

const getBaseUrl = (url?:string) => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    const urlObj = new URL(url as string);
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return urlObj.origin;
};


export const trpcClient = (url?:string)=>{
   return trpc.createClient({
        links: [
            httpBatchLink({
                url:`${getBaseUrl(url)}/api/trpc`,
            }),
        ],
        transformer: superjson
    });
}

```

Then we setup the tanstack react query provider

```tsx
// src/routes/layout.tsx
const [queryClient] = useState(() => new QueryClient());
...
return(
       <trpc.Provider client={trpcClient()} queryClient={queryClient}>
       <QueryClientProvider client={queryClient}>
         <section className="min-h-screen h-full w-full  ">{children}</section>
       </QueryClientProvider>
     </trpc.Provider>
)
```

> Rakkasjs has layouts , like the ones in nextjs app router which lets you wrap multiple pages with a commone layout , the one at the root `src/routes/layout.tsx` wraps the whole app so we can put our providers there

Let's add some tailwind for styling too [official guide](https://tailwindcss.com/docs/guides/vite)


```sh
pnpm i -D tailwindcss postcss autoprefixer daisyui  tailwindcss-animate tailwind-scrollbar tailwindcss-elevation prettier-plugin-tailwindcss
```
```sh
npx tailwindcss init -p
```

Now add the tailwind config content paths
```ts
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
``` 


And include the base css in our layout 

`src/routes/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```tsx
// src/routes/layout.tsx
import ./index.css

```

and now we consume our trpc endpoint 
```tsx
// src/routes/index.page.tsx
import { trpc } from "@/utils/trpc";

export default function HomePage() {
	const query = trpc.hello.hey.useQuery();
	return (
		<main className="flex flex-col gap-2 items-center">
			<h1>Hello world!</h1>
			<h3>{query?.data}</h3>
		</main>
	);
}

``` 
Taddah, Your app is now ready 

![Alt text](docs/image.png)



But you can optimize this futer
