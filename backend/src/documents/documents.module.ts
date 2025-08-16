import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, CloudinaryService, PrismaService],
})
export class DocumentsModule {}