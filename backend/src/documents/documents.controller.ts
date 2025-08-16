import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Param,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Delete,
  Request,
  HttpCode,
  UseGuards,
  
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { DocumentType, DocumentStatus } from '@prisma/client';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('documents')
@UseGuards(JwtGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // Endpoint to upload a document
  @Post('upload/:userId/:appointmentId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('userId') userId: string,
    @Param('appointmentId') appointmentId: string,
    @Body('documentType') documentType: DocumentType,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ 
            maxSize: 10 * 1024 * 1024, // 10MB
            message: 'File size exceeds maximum allowed (10MB)'
          }),
          new FileTypeValidator({
            fileType: /^(application\/pdf|image\/(jpeg|png)|application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)$/,
          }),
        ],
        exceptionFactory: (error) => {
          throw new HttpException(
            error,
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.documentsService.uploadDocument(
      userId,
      appointmentId,
      documentType,
      file,
    );
  }

  // Endpoint to process a document Approve or Reject
  @Post('process/:documentId')
  async processDocument(
    @Param('documentId') documentId: string,
    @Body('officerId') officerId: string,
    @Body('status') status: DocumentStatus,
    @Body('notes') notes?: string,
  ) {
    return this.documentsService.processDocument(
      documentId,
      officerId,
      status,
      notes,
    );
  }


  // Endpoint to get document details by ID
  @Get(':id')
  async getDocumentDetails(@Param('id') documentId: string) {
    return this.documentsService.getDocumentDetails(documentId);
  }


  // Endpoint to get documents by appointment ID
  @Get('appointment/:appointmentId')
  async getDocumentsByAppointment(
    @Param('appointmentId') appointmentId: string,
    @Query('status') status?: DocumentStatus,
  ) {
    return this.documentsService.getDocumentsByAppointment(appointmentId, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  async deleteDocument(
    @Param('id') documentId: string,
    @Request() req // Access user from request
  ) {
    await this.documentsService.deleteDocument(documentId, req.user.id);
  }


}