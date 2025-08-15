import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { OnboardingDto } from './dto/onboarding.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    console.log('hit');
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto, @Request() req: any) {
    console.log('hit');
    return await this.authService.signIn(req.user);
  }

  @Post('complete-onboarding')
  async completeRegistration(
    @Query('id') userId: string,
    @Body() onboardingDto: OnboardingDto,
  ) {
    return await this.authService.completeOnboarding(userId, onboardingDto);
  }

  @Public()
  @Get('refresh')
  async refresh(@Request() req: any) {
    const refreshToken = this.authService.extractRefreshToken(req);
    return (
      refreshToken && (await this.authService.refreshAccessToken(refreshToken))
    );
  }
}
