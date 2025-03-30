import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { EnrollmentsService } from './enrollments.service';
  import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/enums/user-role.enum';
  import { CurrentUser } from '../auth/decorators/current-user.decorator';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiOkResponse,
    ApiParam,
    ApiBody,
  } from '@nestjs/swagger';
  import { SanitizedEnrollmentDto } from './dto/sanitized-enrollment.dto';
  
  @ApiTags('Enrollments')
  @Controller('enrollments')
  export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) {}
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Enroll current user into a class' })
    @ApiOkResponse({ type: SanitizedEnrollmentDto })
    @ApiBody({ type: CreateEnrollmentDto })
    async enroll(
      @CurrentUser('id') userId: number,
      @Body() dto: CreateEnrollmentDto,
    ): Promise<SanitizedEnrollmentDto> {
      return this.enrollmentsService.create(userId, dto);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @Get()
    @ApiOperation({ summary: 'Get all enrollments (Admin only)' })
    @ApiOkResponse({ type: [SanitizedEnrollmentDto] })
    async findAll(): Promise<SanitizedEnrollmentDto[]> {
      return this.enrollmentsService.findAll();
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @Get('class/:id')
    @ApiOperation({ summary: 'Get enrollments by class ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: [SanitizedEnrollmentDto] })
    async findByClass(@Param('id', ParseIntPipe) id: number): Promise<SanitizedEnrollmentDto[]> {
      return this.enrollmentsService.findByClass(id);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @Get('user/:id')
    @ApiOperation({ summary: 'Get enrollments by user ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ type: [SanitizedEnrollmentDto] })
    async findByUser(@Param('id', ParseIntPipe) id: number): Promise<SanitizedEnrollmentDto[]> {
      return this.enrollmentsService.findByUser(id);
    }
  }
  