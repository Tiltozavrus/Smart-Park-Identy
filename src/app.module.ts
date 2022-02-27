import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "root",
        password: "root",
        database: "identy",
        autoLoadEntities: true,
        synchronize: true
      }),
      AuthModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}