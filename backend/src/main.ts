import "dotenv/config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationError } from "class-validator";
import { AppModule } from "./app.module";
import { ValidationException } from "./common/exceptions/api.exceptions";

const bootstrapLogger = new Logger("Bootstrap");

function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => {
    const messages = error.constraints ? Object.values(error.constraints) : [];
    const childMessages = error.children?.length
      ? formatValidationErrors(error.children)
      : [];
    return [...messages, ...childMessages];
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log"],
  });

  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new ValidationException(
          "Validation failed",
          undefined,
          formatValidationErrors(errors),
        ),
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle("DIAM API")
    .setDescription(
      "Digital Internal Audit Management — API documentation",
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token from POST /auth/login",
      },
      "JWT",
    )
    .addTag("Auth", "Authentication endpoints")
    .addTag("Users", "User management")
    .addTag("Roles", "Roles and permissions")
    .addTag("Clients", "Client management")
    .addTag("Engagements", "Audit engagement management")
    .addTag("Engagement Scopes", "Audit scope items per engagement")
    .addTag("Required Documents", "Document checklist per engagement")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  const baseUrl = `http://localhost:${port}`;
  bootstrapLogger.log("------------------------------------------");
  bootstrapLogger.log(`Application running on ${baseUrl}`);
  bootstrapLogger.log(`Swagger docs available at ${baseUrl}/docs`);
  bootstrapLogger.log("------------------------------------------");
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  bootstrapLogger.error("Failed to start application", message);
  process.exit(1);
});
