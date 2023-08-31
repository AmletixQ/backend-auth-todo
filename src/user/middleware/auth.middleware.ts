import { Injectable, NestMiddleware } from "@nestjs/common";
import { UserService } from "../user.service";
import { ExpressRequestInterface } from "src/types/ExpressRequest.interface";
import { NextFunction, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    const token: string = req.cookies["auth-token"];

    if (!token) {
      req.user = null;
      next();
      return;
    }

    try {
      const decode = verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;
      const user = await this.userService.findByID(decode.id);
      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
