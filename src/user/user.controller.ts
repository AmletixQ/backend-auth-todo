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
  ): Promise<UserResponseInterface> {
    const user = await this.userService.signup(loginUserDto);
    return this.userService.buildUserResponse(user);
  }
}
