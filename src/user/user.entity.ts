import { hash } from "bcrypt";
import { TodoEntity } from "src/todo/todo.entity";
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  private async hashPassword() {
    this.password = await hash(this.password, 12);
  }

  @OneToMany(() => TodoEntity, (todo) => todo.author)
  todos: TodoEntity[];
}
