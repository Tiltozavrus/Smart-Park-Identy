import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllAuthServiceExceptionsFilter } from './auth/auth.controller';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('/api/auth')
    const document = SwaggerModule.createDocument(
        app, 
        new DocumentBuilder()
        .setTitle('smart-parking-identy')
        .setDescription('Identy api description')
        .setVersion('1.0')
        .setBasePath('/api/auth')
        .addBearerAuth()
        .build()
    )
    SwaggerModule.setup('api/auth/swagger', app, document)

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllAuthServiceExceptionsFilter(httpAdapter));

    await app.listen(3000);
}
bootstrap();
