import { DataSource, DataSourceOptions } from "typeorm";

const ormconfig: DataSourceOptions = {
  type: "postgres",
  host: "localhost",
  port: +process.env["DB_PORT"],
  username: process.env["DB_USER"],
  password: process.env["DB_PASSWORD"],
  database: "application",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: false,
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
};

export default new DataSource(ormconfig);
