import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../../server";

export const chatRouter = router({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("chats")
        .insert({
          user_id: ctx.session.user.sub,
          content: input.content,
        })
        .select();
      
      if (error) throw error;
      return data[0];
    }),
  
  list: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("chats")
      .select("*")
      .eq("user_id", ctx.session.user.sub)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data;
  }),
});
