import { NestFactory }  from '@nestjs/core';
import { AppModule }    from './app.module';
import * as dotenv       from 'dotenv';

async function main() {
  // Load .env before anything else
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  // Listen on port 3000 by default
  await app.listen(3000);
  console.log('NestJS GraphQL server running at http://localhost:3000/graphql');
}

main();