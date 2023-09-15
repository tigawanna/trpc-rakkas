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

