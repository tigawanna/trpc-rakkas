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


