import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { RolesService } from "../../services/roles/roles.service";
import { RoleDto } from "../../dtos/roles/role.dto";
import {
  PermissionGridDto,
  UpdatePermissionGridDto,
} from "../../dtos/roles/permission-grid.dto";
import { RequireRoles } from "../../common/decorators/roles.decorator";
import { Roles } from "../../common/constants/roles.constants";
import { RoleName } from "../../dtos/common/role.dto";
import { ApiStandardErrors } from "../../common/swagger/api-error.decorator";
import { SwaggerExamples } from "../../common/swagger/api-examples";

@ApiTags("Roles")
@ApiBearerAuth("JWT")
@Controller("roles")
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Get()
  @ApiOperation({ summary: "List roles with permissions (Admin/Manager)" })
  @ApiOkResponse({
    description: "Roles and permissions",
    type: [RoleDto],
    schema: { example: SwaggerExamples.roles.list },
  })
  @ApiStandardErrors()
  findAll() {
    return this.rolesService.findAll();
  }

  @RequireRoles(...Roles.ADMIN_MANAGER)
  @Get(":role/permissions")
  @ApiOperation({ summary: "Get permission grid for a role" })
  @ApiParam({ name: "role", enum: RoleName, example: RoleName.MANAGER })
  @ApiOkResponse({
    description: "Permission grid",
    type: PermissionGridDto,
    schema: { example: SwaggerExamples.roles.permissionGrid },
  })
  @ApiStandardErrors()
  getPermissionGrid(@Param("role") role: RoleName) {
    return this.rolesService.getPermissionGrid(role);
  }

  @RequireRoles(...Roles.ADMIN_ONLY)
  @Patch(":role/permissions")
  @ApiOperation({ summary: "Update permission grid for a role (Admin only)" })
  @ApiParam({ name: "role", enum: RoleName, example: RoleName.MANAGER })
  @ApiBody({
    type: UpdatePermissionGridDto,
    examples: { default: SwaggerExamples.roles.updatePermissions },
  })
  @ApiOkResponse({
    description: "Updated permission grid",
    type: PermissionGridDto,
    schema: { example: SwaggerExamples.roles.permissionGrid },
  })
  @ApiStandardErrors()
  updatePermissionGrid(
    @Param("role") role: RoleName,
    @Body() dto: UpdatePermissionGridDto,
  ) {
    return this.rolesService.updatePermissionGrid(role, dto);
  }
}
