
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const PostSchema = z.object({
    id: z.string().cuid().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    title: z.string(),
    body: z.string(),
})

export type Post = z.infer<typeof PostSchema>

export const postRouter = createTRPCRouter({
    //  get the full list
    getFullList: publicProcedure.query(({ctx}) => {
        const posts = ctx.prisma.post.findMany();
        return posts;
    }),

    create: publicProcedure
    .input(PostSchema)
    .mutation(({ctx, input}) => {
        const post = ctx.prisma.post.create({
            data: input,
        });
        return post;
    }),

    update: publicProcedure
    .input(PostSchema)
    .mutation(({ctx, input}) => {
        const post = ctx.prisma.post.update({ where: {id: input.id},data: input,});
        return post;
    }),
    delete: publicProcedure
    .input(z.object({id: z.string()}))
    .mutation(({ctx, input}) => {
        const post = ctx.prisma.post.delete({ where: {id: input.id}});
        return post;
    })
})
