"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const api_exceptions_1 = require("./common/exceptions/api.exceptions");
const bootstrapLogger = new common_1.Logger("Bootstrap");
function formatValidationErrors(errors) {
    return errors.flatMap((error) => {
        const messages = error.constraints ? Object.values(error.constraints) : [];
        const childMessages = error.children?.length
            ? formatValidationErrors(error.children)
            : [];
        return [...messages, ...childMessages];
    });
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["error", "warn", "log"],
    });
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => new api_exceptions_1.ValidationException("Validation failed", undefined, formatValidationErrors(errors)),
    }));
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("DIAM API")
        .setDescription("Digital Internal Audit Management — API documentation")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter JWT token from POST /auth/login",
    }, "JWT")
        .addTag("Auth", "Authentication endpoints")
        .addTag("Users", "User management")
        .addTag("Roles", "Roles and permissions")
        .addTag("Clients", "Client management")
        .addTag("Engagements", "Audit engagement management")
        .addTag("Engagement Scopes", "Audit scope items per engagement")
        .addTag("Required Documents", "Document checklist per engagement")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("docs", app, document, {
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
bootstrap().catch((error) => {
    const message = error instanceof Error ? error.stack ?? error.message : String(error);
    bootstrapLogger.error("Failed to start application", message);
    process.exit(1);
});
//# sourceMappingURL=main.js.map