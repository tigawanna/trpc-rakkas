import { createTRPCRouter, publicProcedure } from '../trpc';
import { helloRouter } from './hello';
import { postRouter } from './posts';
import { userRouter } from './user';

//  to test using a REST API client use a . to access nested routes insteda of a slash
//ex: http://localhost:5173/api/trpc/welcome
//ex: http://localhost:5173/api/trpc/hello.wave

export const appRouter = createTRPCRouter({
  hello:helloRouter,
  user:userRouter,
  posts:postRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
