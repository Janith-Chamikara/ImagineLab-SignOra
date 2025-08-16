import { Injectable, HttpException, HttpStatus,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DocumentType, DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async uploadDocument(
    userId: string,
    appointmentId: string,
    documentType: DocumentType,
    file: Express.Multer.File,
  ) {
    try {
      // Validate file exists
      if (!file) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      // Upload to Cloudinary
      const uploadResult = await this.cloudinary.uploadFile(file);

      // Create document record
      return await this.prisma.document.create({
        data: {
          fileName: file.originalname,
          originalName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          filePath: uploadResult.public_id,
          documentType,
          userId,
          appointmentId,
          status: 'PENDING',
        },
      });
    } catch (error) {
      // Handle specific Cloudinary errors
      if (error.message.includes('File size too large')) {
        throw new HttpException(
          'File size exceeds maximum allowed',
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }

      // Handle other errors
      throw new HttpException(
        'Failed to upload document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async processDocument(
    documentId: string,
    officerId: string,
    status: DocumentStatus,
    notes?: string,
  ) {
    try {
      // Verify document exists
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
      });

      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      // Update document status
      return await this.prisma.document.update({
        where: { id: documentId },
        data: {
          status,
          processedById: officerId,
          processedAt: new Date(),
          notes,
        },
        include: {
          processedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to process document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getDocumentDetails(documentId: string) {
    try {
      const document = await this.prisma.document.findUnique({
        where: { id: documentId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          processedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!document) {
        throw new HttpException('Document not found', HttpStatus.NOT_FOUND);
      }

      return {
        ...document,
        url: await this.cloudinary.getFileUrl(document.filePath),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // Get documents by appointment ID with optional status filter
  async getDocumentsByAppointment(
  appointmentId: string,
  status?: DocumentStatus,
) {
  return this.prisma.document.findMany({
    where: {
      appointmentId,
      ...(status && { status }), // Optional status filter
    },
    include: {
      user: { select: { firstName: true, lastName: true } },
      processedBy: { select: { firstName: true, lastName: true } },
    },
    orderBy: { uploadedAt: 'desc' },
  });
}

async deleteDocument(documentId: string, userId: string) {
  // Verify document exists and belongs to user
  const document = await this.prisma.document.findUnique({
    where: { id: documentId, userId }
  });

  if (!document) {
    throw new NotFoundException('Document not found or access denied');
  }

  // Delete from Cloudinary
  await this.cloudinary.deleteFile(document.filePath);

  // Delete from database
  return this.prisma.document.delete({
    where: { id: documentId }
  });
}


}