"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ApiLoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiLoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ApiLoggingInterceptor = ApiLoggingInterceptor_1 = class ApiLoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger(ApiLoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const startedAt = Date.now();
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const durationMs = Date.now() - startedAt;
                this.logger.log(`[${method}] ${url} -> ${durationMs}ms`);
            },
            error: () => {
                const durationMs = Date.now() - startedAt;
                this.logger.warn(`[${method}] ${url} -> ${durationMs}ms (failed)`);
            },
        }));
    }
};
exports.ApiLoggingInterceptor = ApiLoggingInterceptor;
exports.ApiLoggingInterceptor = ApiLoggingInterceptor = ApiLoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)()
], ApiLoggingInterceptor);
//# sourceMappingURL=api-logging.interceptor.js.map