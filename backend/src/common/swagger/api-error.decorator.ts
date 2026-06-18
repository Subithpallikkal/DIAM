import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { SwaggerExamples } from "./api-examples";

export function ApiStandardErrors() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: "Validation error",
      schema: { example: SwaggerExamples.errors.validation },
    }),
    ApiUnauthorizedResponse({
      description: "Unauthorized",
      schema: { example: SwaggerExamples.errors.unauthorized },
    }),
    ApiForbiddenResponse({
      description: "Forbidden",
      schema: { example: SwaggerExamples.errors.forbidden },
    }),
    ApiNotFoundResponse({
      description: "Resource not found",
      schema: { example: SwaggerExamples.errors.notFound },
    }),
  );
}
