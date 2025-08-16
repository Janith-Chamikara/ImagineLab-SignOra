import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import {
  fifteenMinutesFromNow,
  getHashedPassword,
  thirtyDaysFromNow,
} from 'src/lib/utils';
import { comparePassword } from 'src/lib/utils';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { NotificationsService } from 'src/notifications/notifications.service';
import {
  NotificationChannel,
  NotificationType,
} from 'src/notifications/dto/create-notification.dto';
import { OnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password, email } = signUpDto;
    const hashedPassword = await getHashedPassword(password);
    if (!hashedPassword) {
      throw new BadRequestException('Cannot hash the given password');
    }
    const isUserExists = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if (isUserExists) {
      throw new ConflictException('The email is already registered.');
    }
    const user = await this.prismaService.user.create({
      data: { ...signUpDto, password: hashedPassword },
    });
    if (user) {
      await this.notificationsService.create({
        userId: user.id,
        title: `Welcome to SignOra`,
        message: `Thank you for signing up. Please complete the onboarding form to get started.`,
        type: NotificationType.SYSTEM_ALERT,
        channel: NotificationChannel.IN_APP,
      });
    }
    if (!user) {
      throw new BadRequestException(
        'Error occurred while creating your account.Try again later.',
      );
    }
    return this.signIn(user);
  }

  async signIn(user: Omit<User, 'password'>) {
    const payload = { ...user };
    return {
      message: 'Success!',
      user: payload,
      accessToken: this.generateAccessToken(payload),
      accessTokenExpiresIn: fifteenMinutesFromNow(),
      refreshToken: this.generateRefreshToken(payload),
      refreshTokenExpiresIn: thirtyDaysFromNow(),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const isUserExists = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    const isOfficerExists = await this.prismaService.officer.findUnique({
      where: {
        email: email,
      },
    });

    if (!isUserExists && !isOfficerExists) {
      throw new BadRequestException('Invalid email.');
    }

    const targetEntity = isUserExists || isOfficerExists;
    const isPasswordCorrect = await comparePassword(
      password,
      targetEntity.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid password');
    }

    if (isUserExists && isPasswordCorrect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = isUserExists;
      return { ...result, role: 'USER' };
    }

    if (isOfficerExists && isPasswordCorrect) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = isOfficerExists;
      return { ...result, role: 'OFFICER' };
    }

    return null;
  }

  async completeOnboarding(userId: string, onboardingDto: OnboardingDto) {
    const isUserExists = this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!isUserExists) {
      throw new NotFoundException('Invalid user id. Please register again');
    }
    const isNationalIdExists = await this.prismaService.user.findFirst({
      where: {
        nationalId: onboardingDto.nationalId,
      },
    });
    if (isNationalIdExists) {
      throw new ConflictException(
        'The provided national Id number is already in use',
      );
    }
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: onboardingDto,
    });
    if (updatedUser) {
      await this.notificationsService.create({
        userId: userId,
        title: `Completed Sign up`,
        message: `You have successfully completed onboarding process. You can start explore our features now`,
        type: NotificationType.SYSTEM_ALERT,
        channel: NotificationChannel.IN_APP,
      });
    }
    return {
      updatedUser,
      message: `You have completed your registration ${updatedUser.firstName}.`,
    };
  }

  generateRefreshToken(payload: Omit<User, 'password'>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
      expiresIn: thirtyDaysFromNow(),
    });
  }
  generateAccessToken(payload: Omit<User, 'password'>) {
    return this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('ACCESS_TOKEN_SECRET'),
      expiresIn: fifteenMinutesFromNow(),
    });
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.getOrThrow('REFRESH_TOKEN_SECRET'),
    });
    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { ...user };
    return {
      accessToken: this.generateAccessToken(payload),
      accessTokenExpiresIn: fifteenMinutesFromNow(),
      refreshToken: this.generateAccessToken(payload),
      refreshTokenExpiresIn: thirtyDaysFromNow(),
    };
  }

  extractRefreshToken(req: Request): string | null {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      throw new UnauthorizedException('No cookies were found');
    }

    const cookies = this.parseCookies(cookieHeader);
    const refreshToken = cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    return refreshToken;
  }

  private parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookieHeader.split(';').forEach((cookie) => {
      const [name, ...rest] = cookie.split('=');
      const value = decodeURIComponent(rest.join('=')).trim();
      if (value !== 'undefined') {
        cookies[name.trim()] = value;
      }
    });
    return cookies;
  }
}
