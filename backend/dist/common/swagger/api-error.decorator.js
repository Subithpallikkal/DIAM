"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiStandardErrors = ApiStandardErrors;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_examples_1 = require("./api-examples");
function ApiStandardErrors() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBadRequestResponse)({
        description: "Validation error",
        schema: { example: api_examples_1.SwaggerExamples.errors.validation },
    }), (0, swagger_1.ApiUnauthorizedResponse)({
        description: "Unauthorized",
        schema: { example: api_examples_1.SwaggerExamples.errors.unauthorized },
    }), (0, swagger_1.ApiForbiddenResponse)({
        description: "Forbidden",
        schema: { example: api_examples_1.SwaggerExamples.errors.forbidden },
    }), (0, swagger_1.ApiNotFoundResponse)({
        description: "Resource not found",
        schema: { example: api_examples_1.SwaggerExamples.errors.notFound },
    }));
}
//# sourceMappingURL=api-error.decorator.js.map