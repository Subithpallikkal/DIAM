import "dotenv/config";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationError } from "class-validator";
import { AppModule } from "./app.module";
import { ValidationException } from "./common/exceptions/api.exceptions";

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
  const app = await NestFactory.create(AppModule);

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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
}

bootstrap();
