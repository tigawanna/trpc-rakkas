import { RequestContext, createRequestHandler } from "rakkasjs";
import { cookie } from "@hattip/cookie";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { uneval } from "devalue";
import { trpc } from "./utils/trpc";
import { trpcClient } from "./utils/client";

declare module "rakkasjs" {
  interface ServerSideLocals {
    session: any;
  }
}

type CreateRequestHandlerParams = Parameters<typeof createRequestHandler>;

const attachSession = async (ctx: RequestContext) => {
  try {
    // ctx.locals.session = await getSession(
    //     ctx.platform.request,
    //     ctx.platform.response
    // );

    ctx.locals.session = {
      user: "jeffery",
    };
  } catch (error) {
    throw new Error("Failed to attach session");
  }
};
const logger = async (ctx: RequestContext) => {
  try {
    console.log("========", ctx.ip, "=============");
  } catch (error) {
    throw new Error("Failed to attach session");
  }
};

export default createRequestHandler({
  middleware: {
    // HatTip middleware to be injected
    // before the page routes handler.
    // @ts-expect-error
    beforePages: [cookie(), attachSession],
    // HatTip middleware to be injected
    // after the page routes handler but
    // before the API routes handler
    beforeApiRoutes: [logger],
    // HatTip middleware to be injected
    // after the API routes handler but
    // before the 404 handler
    beforeNotFound: [],
  },

  createPageHooks(ctx) {
    let queries = Object.create(null);
    console.log("hattip ctx", ctx.request.url);
    return {
      wrapApp(app) {
        const queryCache = new QueryCache({
          onSuccess(data, query) {
            // Store newly fetched data
            queries[query.queryHash] = data;
          },
        });

        const queryClient = new QueryClient({
          queryCache,
          defaultOptions: {
            queries: {
              suspense: true,
              staleTime: Infinity,
              refetchOnWindowFocus: false,
              refetchOnReconnect: false,
            },
          },
        });

        return (
          <trpc.Provider
            client={trpcClient(ctx.request.url)}
            queryClient={queryClient}
          >
            <QueryClientProvider client={queryClient}>
              {app}
            </QueryClientProvider>
          </trpc.Provider>
        );
      },

      emitToDocumentHead() {
        return `<script>$TQD=Object.create(null);$TQS=data=>Object.assign($TQD,data);</script>`;
      },

      emitBeforeSsrChunk() {
        if (Object.keys(queries).length === 0) return "";

        // Emit a script that calls the global $TQS function with the
        // newly fetched query data.

        const queriesString = uneval(queries);
        queries = Object.create(null);
        return `<script>$TQS(${queriesString})</script>`;
      },
    };
  },
});
