import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { CookieOptions, Request, Response } from "express";

export type TCookies = {
  get(param?: string | undefined): any;
  set(
    name: string,
    val: string,
    options: CookieOptions,
  ): Response<any, Record<string, any>>;
  clear(name: string, options?: CookieOptions): Response<any>;
};

export const Cookie = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const response: Response = ctx.switchToHttp().getResponse();

    return {
      get(param?: string | undefined) {
        if (param) {
          return request.cookies[param];
        }

        return request.cookies;
      },
      set(name: string, val: string, options: CookieOptions) {
        return response.cookie(name, val, options);
      },
      clear(name: string, options?: CookieOptions) {
        return response.clearCookie(name, options);
      },
    };
  },
);
