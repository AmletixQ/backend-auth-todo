import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseInterface } from './types/userResponse.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async signin(@Body("user") createUserDTO: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.signin(createUserDTO);
    return this.userService.buildUserResponse(user);
  }
}
