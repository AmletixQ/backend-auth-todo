import { Request } from "express";
import { UserEntity } from "src/user/user.entity";

export interface ExpressRequestInterface extends Request {
  user: UserEntity;
}
