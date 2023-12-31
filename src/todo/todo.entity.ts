import { UserEntity } from "../user/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "todos" })
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => UserEntity, (user) => user.todos, { eager: true })
  author: UserEntity;
}
