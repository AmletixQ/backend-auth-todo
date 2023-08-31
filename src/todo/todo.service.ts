import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TodoEntity } from "./todo.entity";
import { Repository } from "typeorm";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UserEntity } from "src/user/user.entity";
import { UpdateTodoDto } from "./dto/updata-todo.dto";

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async getTodos(currentUserID: number): Promise<TodoEntity[]> {
    const todos = await this.todoRepository.findBy({
      author: {
        id: currentUserID,
      },
    });

    return todos;
  }

  async create(currentUser: UserEntity, createTodoDto: CreateTodoDto) {
    const todo = new TodoEntity();
    Object.assign(todo, createTodoDto);

    todo.author = currentUser;

    return await this.todoRepository.save(todo);
  }

  async update(
    currentUserID: number,
    updateTodoDto: UpdateTodoDto,
    todoID: number,
  ) {
    const todo = await this.todoRepository.findOne({
      where: { id: todoID },
    });

    if (!todo) {
      throw new HttpException("Article does not exists", HttpStatus.NOT_FOUND);
    }

    if (todo.author.id !== currentUserID) {
      throw new HttpException("You are not an author", HttpStatus.FORBIDDEN);
    }

    Object.assign(todo, updateTodoDto);
    return await this.todoRepository.save(todo);
  }
}
