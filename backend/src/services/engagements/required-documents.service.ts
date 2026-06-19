import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import {
  CreateRequiredDocumentDto,
  RequiredDocumentListItemDto,
  UpdateRequiredDocumentDto,
  UpsertRequiredDocumentDto,
} from "../../dtos/engagements/engagement.dto";
import { EngagementsService } from "./engagements.service";

@Injectable()
export class RequiredDocumentsService {
  constructor(
    private prisma: PrismaService,
    private engagementsService: EngagementsService,
  ) {}

  async create(
    engagementId: number,
    dto: CreateRequiredDocumentDto,
  ): Promise<RequiredDocumentListItemDto> {
    await this.engagementsService.ensureExists(engagementId);

    const document = await this.prisma.engagementDocument.create({
      data: {
        engagementUid: engagementId,
        documentName: dto.documentName,
        isRequired: dto.isRequired ?? true,
      },
    });

    return this.toListItem(document);
  }

  async upsert(
    engagementId: number,
    dto: UpsertRequiredDocumentDto,
  ): Promise<RequiredDocumentListItemDto> {
    const { id, documentName, ...data } = dto;
    if (id != null) {
      return this.update(engagementId, id, data);
    }
    if (!documentName?.trim()) {
      throw new BadRequestException("documentName is required");
    }
    return this.create(engagementId, {
      documentName,
      isRequired: data.isRequired,
    });
  }

  async findAll(
    engagementId: number,
  ): Promise<RequiredDocumentListItemDto[]> {
    await this.engagementsService.ensureExists(engagementId);

    const documents = await this.prisma.engagementDocument.findMany({
      where: { engagementUid: engagementId },
      orderBy: { uid: "asc" },
    });

    return documents.map((document) => this.toListItem(document));
  }

  async update(
    engagementId: number,
    docId: number,
    dto: UpdateRequiredDocumentDto,
  ): Promise<RequiredDocumentListItemDto> {
    await this.engagementsService.ensureExists(engagementId);

    const document = await this.prisma.engagementDocument.findFirst({
      where: { uid: docId, engagementUid: engagementId },
    });

    if (!document) {
      throw new NotFoundException(
        `Document ${docId} not found for engagement ${engagementId}`,
      );
    }

    const updated = await this.prisma.engagementDocument.update({
      where: { uid: docId },
      data: dto,
    });

    return this.toListItem(updated);
  }

  private toListItem(document: {
    uid: number;
    documentName: string;
    isRequired: boolean;
    isReceived: boolean;
  }): RequiredDocumentListItemDto {
    return {
      id: document.uid,
      documentName: document.documentName,
      isRequired: document.isRequired,
      isReceived: document.isReceived,
    };
  }
}
