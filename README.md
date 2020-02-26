# sequelize-log-sql-issue

This repo reproduces an [issue](https://github.com/sequelize/sequelize/issues/10067) with logging single `INSERT` and
`UPDATE` SQL queries. In Sequelize v5.21.5 parameters' values binded to a SQL query don't substitute tokens
prefixed with `$` (`$1`, `$2`, `$3`, etc...) when logging the SQL query.

## Installation

1. Clone the repo:

    ```bash
    git clone git@github.com:ezze/sequelize-log-sql-issue
    ```

2. Install dependencies:

    ```bash
    yarn
    ```

3. Configure database connection in `config/config.json` file.

4. Create a database:

    ```bash
    yarn db:create
    ```

5. Run a script to reproduce the issue:

    ```bash
    yarn start
    ```

Expected (Sequelize v4) output:

```
Executing (...): START TRANSACTION;
Executing (...): INSERT INTO "task" ("id","created_at","updated_at","name","status") VALUES (DEFAULT,'2018-10-23 13:58:05.380 +00:00','2018-10-23 13:58:05.380 +00:00','First task',1) RETURNING *;
Executing (...): INSERT INTO "task" ("id","created_at","updated_at","name","status") VALUES (DEFAULT,'2018-10-23 13:58:05.387 +00:00','2018-10-23 13:58:05.387 +00:00','Second task',1),(DEFAULT,'2018-10-23 13:58:05.387 +00:00','2018-10-23 13:58:05.387 +00:00','Third task',0);
Executing (...): SELECT "id", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "name", "status" FROM "task" AS "task" WHERE "task"."status" = 1;
Executing (...): UPDATE "task" SET "status"=2,"updated_at"='2018-10-23 13:58:05.398 +00:00' WHERE "status" = 1
Executing (...): COMMIT;
```

Given (Sequelize v5.21.5) output:

```
Executing (...): START TRANSACTION;
Executing (...): INSERT INTO "task" ("id","created_at","updated_at","name","status") VALUES (DEFAULT,$1,$2,$3,$4) RETURNING *;
Executing (...): INSERT INTO "task" ("id","created_at","updated_at","name","status") VALUES (DEFAULT,'2020-02-26 20:42:28.062 +00:00','2020-02-26 20:42:28.062 +00:00','Second task',1),(DEFAULT,'2020-02-26 20:42:28.062 +00:00','2020-02-26 20:42:28.062 +00:00','Third task',0) RETURNING *;
Executing (...): SELECT "id", "created_at" AS "createdAt", "updated_at" AS "updatedAt", "name", "status" FROM "task" AS "task" WHERE "task"."status" = 1;
Executing (...): UPDATE "task" SET "status"=$1,"updated_at"=$2 WHERE "status" = $3
Executing (...): COMMIT;
```
