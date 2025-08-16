import { DocumentType, DocumentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  appointmentId: string;

  @IsEnum(DocumentType)
  documentType: DocumentType;
}

export class UpdateDocumentStatusDto {
  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class DocumentResponseDto {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  documentType: DocumentType;
  status: DocumentStatus;
  url: string;
  uploadedAt: Date;
}