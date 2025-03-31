import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    ParseIntPipe,
    Body,
    UseGuards,
  } from '@nestjs/common';
  import { SchedulesService } from './schedules.service';
  import { CreateScheduleDto } from './dto/create-schedule.dto';
  import { UpdateScheduleDto } from './dto/update-schedule.dto';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/enums/user-role.enum';
  import {
    ApiTags,
    ApiBearerAuth,
    ApiOperation,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiBody,
    ApiParam,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
  } from '@nestjs/swagger';
  import { SanitizedScheduleDto } from './dto/sanitized-schedule.dto';
  
  @ApiTags('Schedules')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Controller('schedules')
  export class SchedulesController {
    constructor(private readonly schedulesService: SchedulesService) {}
  
    @Post()
    @ApiOperation({
      summary: 'Create a new schedule entry',
      description: 'Admin-only route to create a schedule for a specific class.',
    })
    @ApiOkResponse({
      description: 'Schedule created successfully',
      type: SanitizedScheduleDto,
    })
    @ApiBody({
      type: CreateScheduleDto,
      description: 'Payload to create a schedule entry',
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can create schedules' })
    async create(@Body() dto: CreateScheduleDto): Promise<SanitizedScheduleDto> {
      return this.schedulesService.create(dto);
    }
  
    @Get()
    @ApiOperation({
      summary: 'List all schedules',
      description: 'Returns all scheduled class sessions. Admin-only access.',
    })
    @ApiOkResponse({
      description: 'Array of schedule entries',
      type: [SanitizedScheduleDto],
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can list schedules' })
    async findAll(): Promise<SanitizedScheduleDto[]> {
      return this.schedulesService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({
      summary: 'Get a schedule by ID',
      description: 'Returns details of a single schedule entry by its ID.',
    })
    @ApiOkResponse({
      description: 'Schedule entry found',
      type: SanitizedScheduleDto,
    })
    @ApiParam({
      name: 'id',
      type: Number,
      description: 'ID of the schedule entry',
    })
    @ApiNotFoundResponse({ description: 'Schedule not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can access this resource' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SanitizedScheduleDto> {
      return this.schedulesService.findOne(id);
    }
  
    @Put(':id')
    @ApiOperation({
      summary: 'Update a schedule by ID',
      description: 'Admin-only route to update the schedule entry for a class.',
    })
    @ApiOkResponse({
      description: 'Schedule updated successfully',
      type: SanitizedScheduleDto,
    })
    @ApiParam({
      name: 'id',
      type: Number,
      description: 'ID of the schedule to update',
    })
    @ApiBody({
      type: UpdateScheduleDto,
      description: 'Fields to update on the schedule entry',
    })
    @ApiNotFoundResponse({ description: 'Schedule not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can update schedules' })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateScheduleDto,
    ): Promise<SanitizedScheduleDto> {
      return this.schedulesService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({
      summary: 'Delete a schedule by ID',
      description: 'Admin-only route to remove a schedule entry.',
    })
    @ApiOkResponse({
      description: 'Schedule deleted successfully',
      schema: {
        example: {
          message: 'Schedule deleted successfully',
        },
      },
    })
    @ApiParam({
      name: 'id',
      type: Number,
      description: 'ID of the schedule to delete',
    })
    @ApiNotFoundResponse({ description: 'Schedule not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can delete schedules' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.schedulesService.remove(id);
    }
  }
  