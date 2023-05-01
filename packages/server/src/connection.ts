import Knex from "knex";

export const knex = Knex({
  client: "mysql",
  connection: {
    host: "192.168.11.2",
    port: 3306,
    user: "traiding",
    password: "traiding",
    database: "traiding_simulator_db",
    timezone: "Asia/Tokyo",
  },
});
