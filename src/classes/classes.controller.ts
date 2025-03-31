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
  @ApiOperation({
    summary: 'Get all sports classes',
    description:
      'Returns a list of all sports classes. Can optionally be filtered by sport name(s), e.g. ?sports=Basketball,Football',
  })
  @ApiQuery({
    name: 'sports',
    required: false,
    type: String,
    isArray: true,
    example: ['Basketball', 'Football'],
    description: 'Optional filter by sport names (comma-separated or repeated)',
  })
  @ApiOkResponse({
    description: 'List of classes',
    type: [SanitizedClassDto],
  })
  async findAll(@Query('sports') sports?: string | string[]): Promise<SanitizedClassDto[]> {
    const sportsFilter = typeof sports === 'string' ? sports.split(',') : sports;
    return this.classesService.findAll(sportsFilter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get class by ID',
    description: 'Returns details of a specific class by its ID',
  })
  @ApiOkResponse({
    description: 'Class found and returned',
    type: SanitizedClassDto,
  })
  @ApiNotFoundResponse({
    description: 'No class found with the given ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the class to retrieve',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SanitizedClassDto> {
    return this.classesService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new class (Admin only)',
    description: 'Allows admins to create a new sports class',
  })
  @ApiOkResponse({
    description: 'Class successfully created',
    type: SanitizedClassDto,
  })
  @ApiBody({
    type: CreateClassDto,
    description: 'Class creation payload including sport ID, description, and duration',
  })
  async create(@Body() dto: CreateClassDto): Promise<SanitizedClassDto> {
    return this.classesService.create(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update an existing class (Admin only)',
    description: 'Allows admins to update class details by ID',
  })
  @ApiOkResponse({
    description: 'Class updated successfully',
    type: SanitizedClassDto,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the class to update',
  })
  @ApiBody({
    type: UpdateClassDto,
    description: 'Fields to update on the class',
  })
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
  @ApiOperation({
    summary: 'Delete a class (Admin only)',
    description: 'Deletes a class by ID. Admin access required.',
  })
  @ApiOkResponse({
    description: 'Class deleted successfully',
    schema: {
      example: {
        message: 'Class deleted successfully',
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the class to delete',
  })
  @ApiNotFoundResponse({
    description: 'No class found with the given ID',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.classesService.remove(id);
  }
}
