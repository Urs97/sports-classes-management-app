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
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
  } from '@nestjs/swagger';
  import { SanitizedEnrollmentDto } from './dto/sanitized-enrollment.dto';
  
  @ApiTags('Enrollments')
  @Controller('enrollments')
  export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) {}
  
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({
      summary: 'Enroll the current user into a class',
      description: 'Authenticated users can enroll themselves in a class by providing the class ID.',
    })
    @ApiBody({
      type: CreateEnrollmentDto,
      description: 'Class ID the user wishes to enroll in',
    })
    @ApiOkResponse({
      description: 'User successfully enrolled in the class',
      type: SanitizedEnrollmentDto,
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
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
    @ApiOperation({
      summary: 'Get all enrollments (Admin only)',
      description: 'Returns all user-class enrollments in the system.',
    })
    @ApiOkResponse({
      description: 'List of all enrollments',
      type: [SanitizedEnrollmentDto],
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
    @ApiForbiddenResponse({ description: 'Only admins can access this route' })
    async findAll(): Promise<SanitizedEnrollmentDto[]> {
      return this.enrollmentsService.findAll();
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @Get('class/:id')
    @ApiOperation({
      summary: 'Get all enrollments for a specific class (Admin only)',
      description: 'Returns all users enrolled in a specific class by class ID.',
    })
    @ApiParam({
      name: 'id',
      type: Number,
      description: 'ID of the class',
    })
    @ApiOkResponse({
      description: 'List of enrollments for the specified class',
      type: [SanitizedEnrollmentDto],
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
    @ApiForbiddenResponse({ description: 'Only admins can access this route' })
    async findByClass(@Param('id', ParseIntPipe) id: number): Promise<SanitizedEnrollmentDto[]> {
      return this.enrollmentsService.findByClass(id);
    }
  
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @Get('user/:id')
    @ApiOperation({
      summary: 'Get all enrollments for a specific user (Admin only)',
      description: 'Returns all class enrollments for a given user by user ID.',
    })
    @ApiParam({
      name: 'id',
      type: Number,
      description: 'ID of the user',
    })
    @ApiOkResponse({
      description: 'List of enrollments for the specified user',
      type: [SanitizedEnrollmentDto],
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
    @ApiForbiddenResponse({ description: 'Only admins can access this route' })
    async findByUser(@Param('id', ParseIntPipe) id: number): Promise<SanitizedEnrollmentDto[]> {
      return this.enrollmentsService.findByUser(id);
    }
  }
  