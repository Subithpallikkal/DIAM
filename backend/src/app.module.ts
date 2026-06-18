import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";
import { ApiLoggingInterceptor } from "./common/interceptors/api-logging.interceptor";
import { PrismaModule } from "./common/prisma/prisma.module";
import { CacheModule } from "./common/cache/cache.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ClientsModule } from "./modules/clients/clients.module";
import { EngagementsModule } from "./modules/engagements/engagements.module";
import { DocumentsModule } from "./modules/documents/documents.module";
import { RisksModule } from "./modules/risks/risks.module";
import { TasksModule } from "./modules/tasks/tasks.module";
import { IssuesModule } from "./modules/issues/issues.module";
import { ReportsModule } from "./modules/reports/reports.module";

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    EngagementsModule,
    DocumentsModule,
    RisksModule,
    TasksModule,
    IssuesModule,
    ReportsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ApiLoggingInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
