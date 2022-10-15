import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EventsGateway } from './events/events.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(6161);
}
bootstrap();


