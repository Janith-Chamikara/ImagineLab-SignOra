import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppointmentsModule } from './appointments/appointments.module';

import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, AppointmentsModule, DocumentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
