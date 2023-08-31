import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/login-user.dto";
import { Cookie, TCookies } from "./decorators/cookie.decorator";
import { AuthGuard } from "./guard/auth.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async signin(
    @Body("user") createUserDTO: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.signin(createUserDTO);
    return this.userService.buildUserResponse(user);
  }

  @Post("login")
  @UsePipes(new ValidationPipe())
  async signup(
    @Body("user") loginUserDto: LoginUserDto,
    @Cookie() cookies: TCookies,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.signup(loginUserDto);
    const buildUser = this.userService.buildUserResponse(user);
    cookies.set("auth-token", buildUser.user.token, { httpOnly: true });
    return buildUser;
  }

  @Post("logout")
  async logout(@Cookie() cookie: TCookies) {
    cookie.clear("auth-token");
  }

  @Get()
  @UseGuards(AuthGuard)
  async _() {
    return { res: true };
  }
}
