import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/login-user.dto";
import { Cookie, TCookies } from "./decorators/cookie.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async signup(
    @Body("user") createUserDTO: CreateUserDto,
    @Cookie() cookies: TCookies,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.signup(createUserDTO);
    const buildUser = this.userService.buildUserResponse(user);

    cookies.set("auth-token", buildUser.user.token, {
      httpOnly: true,
    });

    delete buildUser.user.token;
    return buildUser;
  }

  @Post("login")
  @UsePipes(new ValidationPipe())
  async signin(
    @Body("user") loginUserDto: LoginUserDto,
    @Cookie() cookies: TCookies,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.signin(loginUserDto);
    const buildUser = this.userService.buildUserResponse(user);

    cookies.set("auth-token", buildUser.user.token, { httpOnly: true });

    delete buildUser.user.token;
    return buildUser;
  }

  @Post("logout")
  async logout(@Cookie() cookie: TCookies) {
    cookie.clear("auth-token");
  }
}
