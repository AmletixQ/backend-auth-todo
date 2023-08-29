import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { TodoModule } from "./todo/todo.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { connectionSource, config } from "./ormconfig";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return config;
      },
      dataSourceFactory: async () => {
        await connectionSource.initialize();
        return connectionSource;
      },
    }),
    UserModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
