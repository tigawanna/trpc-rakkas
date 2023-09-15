import { createTRPCRouter, publicProcedure } from "../trpc";


export const helloRouter = createTRPCRouter({
    hey: publicProcedure.query((opts) => {
        return `Hey there`;
    }),
    wave: publicProcedure.query(async(opts) => {
        return `🙋‍♀️`;
    }),

})
