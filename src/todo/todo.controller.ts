import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { AuthGuard } from "src/user/guard/auth.guard";
import { User } from "src/user/decorators/user.decorator";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UserEntity } from "src/user/user.entity";
import { UpdateTodoDto } from "./dto/updata-todo.dto";

@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Body("todo") createTodoDto: CreateTodoDto,
  ) {
    return await this.todoService.create(currentUser, createTodoDto);
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @User("id") currentUserID: number,
    @Param("id") todoID: number,
    @Body("todo") updateTodoDto: UpdateTodoDto,
  ) {
    return await this.todoService.update(currentUserID, updateTodoDto, todoID);
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async delete(@User("id") currentUserID: number, @Param("id") todoID: number) {
    return await this.todoService.delete(currentUserID, todoID);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getTodos(@User("id") currentUserID: number) {
    return await this.todoService.getTodos(currentUserID);
  }
}
