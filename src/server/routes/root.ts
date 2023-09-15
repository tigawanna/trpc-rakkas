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
