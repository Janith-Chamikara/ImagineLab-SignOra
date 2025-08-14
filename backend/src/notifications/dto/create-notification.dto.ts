import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum NotificationType {
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  APPOINTMENT_UPDATE = 'APPOINTMENT_UPDATE',
  DOCUMENT_STATUS = 'DOCUMENT_STATUS',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  IN_APP = 'IN_APP',
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsOptional()
  @IsString()
  readonly officerId?: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsEnum(NotificationType)
  @IsNotEmpty()
  readonly type: NotificationType;

  @IsEnum(NotificationChannel)
  @IsNotEmpty()
  readonly channel: NotificationChannel;

  @IsBoolean()
  @IsOptional()
  readonly isRead?: boolean;
}
