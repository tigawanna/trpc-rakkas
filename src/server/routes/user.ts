import { UserSchema } from "prisma/generated/zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";


export const userRouter = createTRPCRouter({
    //  get the full list
    getFullList: publicProcedure.query(({ctx}) => {
        const users = ctx.prisma.user.findMany();
        return users;
    }),

    create: publicProcedure
    .input(UserSchema)
    .mutation(({ctx, input}) => {
        const user = ctx.prisma.user.create({
            data: input,
        });
        return user;
    }),

    update: publicProcedure
    .input(UserSchema)
    .mutation(({ctx, input}) => {
        const user = ctx.prisma.user.update({ where: {id: input.id},data: input,});
        return user;
    }),
    delte: publicProcedure
    .input(z.object({id: z.string()}))
    .mutation(({ctx, input}) => {
        const user = ctx.prisma.user.delete({ where: {id: input.id}});
        return user;
    })
})
