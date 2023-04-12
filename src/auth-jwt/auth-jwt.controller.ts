import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Body,
  UseGuards,
  UseFilters,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { AuthJwtService } from './auth-jwt.service'
import { Public, GetCurrentUserId, GetCurrentUser } from './decorators'
import { CreateUserDto, SigninDto, TokensDto } from './dto'
import { RtGuard } from './guards'
import { Tokens, TokensWithRtSessionId } from './types'
import { Response } from 'express'
import { PrismaClientExceptionFilter } from '../prisma/prisma-client-exception'

@Controller('auth')
@ApiTags('Authorization JWT')
@UseFilters(PrismaClientExceptionFilter)
export class AuthJwtController {
  constructor(private authJwtService: AuthJwtService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Signup locally' })
  @ApiOkResponse({ type: TokensDto })
  async signupLocal(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: CreateUserDto,
  ): Promise<TokensWithRtSessionId> {
    const { access_token, refresh_token, rt_session_id } = await this.authJwtService.signupLocal(
      dto,
    )

    this.authJwtService.addTokensToCookies(res, { access_token, refresh_token, rt_session_id })

    return { access_token, refresh_token, rt_session_id }
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Signin locally' })
  @ApiOkResponse({ type: TokensDto })
  async signinLocal(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: SigninDto,
  ): Promise<TokensWithRtSessionId> {
    const { access_token, refresh_token, rt_session_id } = await this.authJwtService.signinLocal(
      dto,
    )

    this.authJwtService.addTokensToCookies(res, { access_token, refresh_token, rt_session_id })

    return { access_token, refresh_token, rt_session_id }
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('local/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Refresh tokens' })
  @ApiOkResponse({ type: TokensDto })
  async refreshTokens(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUser('rtSessionId') rtSessionId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const { access_token, refresh_token, rt_session_id } = await this.authJwtService.refreshTokens({
      rtSessionId,
      refreshToken,
    })

    this.authJwtService.addTokensToCookies(res, { access_token, refresh_token, rt_session_id })

    return { refresh_token, access_token }
  }

  @Post('local/logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Logout' })
  @ApiOkResponse()
  async logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const isLogout = await this.authJwtService.logout(userId)

    this.authJwtService.clearCookies(res)

    return isLogout
  }
}
