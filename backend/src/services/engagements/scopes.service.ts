import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import {
  CreateScopeDto,
  ScopeListItemDto,
} from "../../dtos/engagements/engagement.dto";
import { EngagementsService } from "./engagements.service";

@Injectable()
export class ScopesService {
  constructor(
    private prisma: PrismaService,
    private engagementsService: EngagementsService,
  ) {}

  async create(
    engagementId: number,
    dto: CreateScopeDto,
  ): Promise<ScopeListItemDto> {
    await this.engagementsService.ensureExists(engagementId);

    const scope = await this.prisma.auditScope.create({
      data: {
        engagementUid: engagementId,
        name: dto.name,
        description: dto.description,
      },
    });

    return this.toListItem(scope);
  }

  async findAll(engagementId: number): Promise<ScopeListItemDto[]> {
    await this.engagementsService.ensureExists(engagementId);

    const scopes = await this.prisma.auditScope.findMany({
      where: { engagementUid: engagementId },
      orderBy: { uid: "asc" },
    });

    return scopes.map((scope) => this.toListItem(scope));
  }

  async remove(engagementId: number, scopeId: number): Promise<void> {
    await this.engagementsService.ensureExists(engagementId);

    const scope = await this.prisma.auditScope.findFirst({
      where: { uid: scopeId, engagementUid: engagementId },
    });

    if (!scope) {
      throw new NotFoundException(
        `Scope ${scopeId} not found for engagement ${engagementId}`,
      );
    }

    await this.prisma.auditScope.delete({ where: { uid: scopeId } });
  }

  private toListItem(scope: {
    uid: number;
    name: string;
    description: string | null;
    isActive: boolean;
  }): ScopeListItemDto {
    return {
      id: scope.uid,
      name: scope.name,
      description: scope.description,
      isActive: scope.isActive,
    };
  }
}
