import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, DepartmentModule, AppointmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
