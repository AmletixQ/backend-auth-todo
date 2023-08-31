import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TodoEntity } from "./todo.entity";
import { Repository } from "typeorm";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { UserEntity } from "src/user/user.entity";

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
}
