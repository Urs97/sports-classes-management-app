import {
    Controller, Get, Post, Put, Delete, Param, Body, Query,
    ParseIntPipe, UseGuards
  } from '@nestjs/common';
  import { ClassesService } from './classes.service';
  import { CreateClassDto } from './dto/create-class.dto';
  import { UpdateClassDto } from './dto/update-class.dto';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/enums/user-role.enum';
  import {
    ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiQuery, ApiParam,
    ApiNotFoundResponse, ApiBody
  } from '@nestjs/swagger';
  import { SanitizedClassDto } from './dto/sanitized-class.dto';
  
  @ApiTags('Classes')
  @Controller('classes')
  export class ClassesController {
    constructor(private readonly classesService: ClassesService) {}
  
    @Get()
    @ApiQuery({ name: 'sports', required: false, type: String, isArray: true })
    @ApiOkResponse({ type: [SanitizedClassDto] })
    @ApiOperation({ summary: 'Get all classes (filterable by sport)' })
    async findAll(@Query('sports') sports?: string | string[]): Promise<SanitizedClassDto[]> {
      const sportsFilter = typeof sports === 'string' ? sports.split(',') : sports;
      return this.classesService.findAll(sportsFilter);
    }    
  
    @Get(':id')
    @ApiOperation({ summary: 'Get class details by ID' })
    @ApiOkResponse({ type: SanitizedClassDto })
    @ApiParam({ name: 'id', type: Number })
    @ApiNotFoundResponse({ description: 'Class not found' })
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<SanitizedClassDto> {
      return this.classesService.findOne(id);
    }
  
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new class (Admin only)' })
    @ApiOkResponse({ type: SanitizedClassDto })
    @ApiBody({ type: CreateClassDto })
    async create(@Body() dto: CreateClassDto): Promise<SanitizedClassDto> {
      return this.classesService.create(dto);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a class (Admin only)' })
    @ApiOkResponse({ type: SanitizedClassDto })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateClassDto })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateClassDto,
    ): Promise<SanitizedClassDto> {
      return this.classesService.update(id, dto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a class (Admin only)' })
    @ApiOkResponse({ description: 'Class deleted' })
    @ApiParam({ name: 'id', type: Number })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.classesService.remove(id);
    }
  }
  