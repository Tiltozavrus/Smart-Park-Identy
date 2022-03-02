import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

export const Testing = {
    testDatabase(): DynamicModule {
        return TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "root",
            password: "root",
            database: "identy",
            autoLoadEntities: true,
            synchronize: true
          })
    }
}