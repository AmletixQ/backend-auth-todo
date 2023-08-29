import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";

import * as dotenv from "dotenv";
import { UserResponseInterface } from "./types/userResponse.interface";
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async signin(createUserDto: CreateUserDto) {
    const userByEmail = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    const userByUsername = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });

    if (userByEmail || userByUsername) {
      throw new HttpException(
        "Email or username are taken",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const user = new UserEntity();
    Object.assign(user, createUserDto);

    return await this.userRepository.save(user);
  }

  private generate(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    delete user.password;
    return {
      user: {
        ...user,
        token: this.generate(user),
      },
    };
  }
}
