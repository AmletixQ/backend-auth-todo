import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { ExpressRequestInterface } from "src/types/ExpressRequest.interface";

type TUserProperties = "id" | "email" | "username";
export const User = createParamDecorator(
  (data: TUserProperties, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExpressRequestInterface>();

    if (!request.user) {
      return null;
    }

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
