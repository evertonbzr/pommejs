import { FastifyReply, FastifyRequest } from "fastify";

export type ReqMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type Handler = (
  request: FastifyRequest,
  reply: FastifyReply
) => Promise<any>;
