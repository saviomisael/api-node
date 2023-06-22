# Games API

Esse projeto é uma API REST que usa a abordagem do DDD.

Há uma versão deste projeto que usa TypeORM e Postgresql, você pode conferir esta versão [aqui](https://github.com/saviomisael/api-node/tree/typeorm).

# Tecnologias

- [Typescript](https://www.typescriptlang.org/)
- [Husky](https://typicode.github.io/husky/#/)
- [Lint-staged](https://github.com/okonet/lint-staged)
- [EditorConfig](https://editorconfig.org/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Docker](https://docs.docker.com/engine/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Redis Stack Server](https://redis.io/docs/stack/)
- [Mocha](https://mochajs.org/)
- [chai](https://www.chaijs.com/)
- [chai-http](https://www.chaijs.com/plugins/chai-http/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [class-validator](https://github.com/typestack/class-validator)
- [Express](https://expressjs.com/pt-br/)
- [handlebars](https://handlebarsjs.com/)
- [JWT](https://jwt.io/)
- [MySQL](https://www.mysql.com/)
- [Nodemailer](https://nodemailer.com/about/)
- [Swagger](https://swagger.io/)

## Design Patterns
- `DTO`
- `Mapper`
- `Service`
- `Entity`
- `Repository`
- `Value Object`
- `Singleton`
- `Factory`

## Scripts Disponíveis

Este projeto precisa do Docker e do Docker Compose para ser executado. Na pasta do projeto você pode rodar os seguintes comandos:

### `npm run lint`

Roda o eslint para verificar o code-style dos arquivos typescript.

### `npm run test:unit:docker`

Roda os testes unitários dentro do container.

### `npm run test:functional:docker`

Roda os testes funcionais dentro do container.

### `npm run coverage:docker`

Gera a pasta coverage com o relatório da cobertura de testes.

# Como rodar o projeto

Inicie os containers com docker compose:

```
docker compose up
```

