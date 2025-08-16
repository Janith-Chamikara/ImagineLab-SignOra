import { DocumentType, DocumentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';



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