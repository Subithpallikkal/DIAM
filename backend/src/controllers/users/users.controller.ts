import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "../../services/users/users.service";
import {
  CreateUserDto,
  UpdateUserDto,
  UserDetailDto,
  UserListItemDto,
} from "../../dtos/users/user.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { JwtPayload } from "../../common/interfaces/jwt-payload.interface";
import { PaginationQueryDto } from "../../dtos/common/pagination.dto";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";

@ApiTags("Users")
@ApiBearerAuth("JWT")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @RequireRoles(...Roles.ADMIN_ONLY)
  @Post()
  @ApiOperation({ summary: "Create a new user (Admin only)" })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: "User created", type: UserDetailDto })
  @ApiStandardErrors()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Get()
  @ApiOperation({ summary: "List all users (Admin/Manager)" })
  @ApiOkResponse({ description: "List of users", type: [UserListItemDto] })
  @ApiResponse({ status: 403, description: "Forbidden" })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Get(":id")
  @ApiOperation({ summary: "Get user details by id" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiOkResponse({ description: "User details", type: UserDetailDto })
  @ApiStandardErrors()
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @RequireRoles(...Roles.ADMIN_ONLY)
  @Patch(":id")
  @ApiOperation({ summary: "Update user details (Admin only)" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: "User updated", type: UserDetailDto })
  @ApiStandardErrors()
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @RequireRoles(...Roles.ADMIN_ONLY)
  @Delete(":id")
  @ApiOperation({ summary: "Deactivate a user (Admin only)" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @ApiOkResponse({ description: "User deactivated", type: UserDetailDto })
  @ApiStandardErrors()
  deactivate(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.usersService.deactivate(id, user.sub);
  }
}
