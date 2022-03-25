import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
      ConfigModule.forRoot(
          {
              isGlobal: true,
          }
      ),
      TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                autoLoadEntities: true,
                synchronize: true,
                url: configService.get<string>("IDENTY_DATABASE_URI")
            }),
            inject: [ConfigService]
      }),
      AuthModule,
      
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
