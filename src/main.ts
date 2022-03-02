import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    const document = SwaggerModule.createDocument(
        app, 
        new DocumentBuilder()
        .setTitle('smart-parking-identy')
        .setDescription('Identy api description')
        .setVersion('1.0')
        .build()
    )

    SwaggerModule.setup('swagger', app, document)

    await app.listen(3000);
}
bootstrap();
