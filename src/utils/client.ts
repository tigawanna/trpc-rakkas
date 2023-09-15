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
                url:url?`${getBaseUrl(url)}/api/trpc`:"/api/trpc",
            }),
        ],
        transformer: superjson
    });
}
