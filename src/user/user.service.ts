import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";

import * as dotenv from "dotenv";
import { UserResponseInterface } from "./types/userResponse.interface";
import { compare } from "bcrypt";
import { LoginUserDto } from "./dto/login-user.dto";

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

  async signup(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: ["id", "email", "username", "password"],
    });

    if (!user) {
      throw new HttpException(
        "Credentials are not valid",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const passwordMatch = await compare(loginUserDto.password, user.password);

    if (!passwordMatch) {
      throw new HttpException(
        "Credentials are not valid",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    delete user.password;

    return user;
  }

  async findByID(id: number): Promise<UserEntity> {
    const user = this.userRepository.findOne({
      where: { id },
    });

    return user;
  }

  private generate(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      },
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
