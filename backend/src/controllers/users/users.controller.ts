import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "../../services/users/users.service";
import { UserListItemDto } from "../../dtos/users/user-list-item.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { SwaggerExamples } from "../../common/swagger/api-examples";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";

@ApiTags("Users")
@ApiBearerAuth("JWT")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Get()
  @ApiOperation({ summary: "List all users (Admin/Manager)" })
  @ApiOkResponse({
    description: "List of users",
    type: [UserListItemDto],
    schema: { example: SwaggerExamples.users.list },
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden",
    schema: { example: SwaggerExamples.errors.forbidden },
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }
}
