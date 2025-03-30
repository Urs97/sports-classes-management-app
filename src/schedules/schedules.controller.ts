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
    @ApiOperation({ summary: 'Create a schedule (Admin only)' })
    @ApiOkResponse({ type: SanitizedScheduleDto })
    @ApiBody({ type: CreateScheduleDto })
    async create(@Body() dto: CreateScheduleDto): Promise<SanitizedScheduleDto> {
      return this.schedulesService.create(dto);
    }
  
    @Get()
    @ApiOperation({ summary: 'List all schedules (Admin only)' })
    @ApiOkResponse({ type: [SanitizedScheduleDto] })
    async findAll(): Promise<SanitizedScheduleDto[]> {
      return this.schedulesService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a schedule by ID' })
    @ApiOkResponse({ type: SanitizedScheduleDto })
    @ApiParam({ name: 'id', type: Number })
    @ApiNotFoundResponse({ description: 'Schedule not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SanitizedScheduleDto> {
      return this.schedulesService.findOne(id);
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update a schedule by ID' })
    @ApiOkResponse({ type: SanitizedScheduleDto })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateScheduleDto })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateScheduleDto,
    ): Promise<SanitizedScheduleDto> {
      return this.schedulesService.update(id, dto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a schedule by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiOkResponse({ description: 'Schedule deleted' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.schedulesService.remove(id);
    }
  }
  