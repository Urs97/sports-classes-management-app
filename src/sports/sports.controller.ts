import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { SportsService } from './sports.service';
  import { CreateSportDto } from './dto/create-sport.dto';
  import { UpdateSportDto } from './dto/update-sport.dto';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from '../users/enums/user-role.enum';
  import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiParam,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
  } from '@nestjs/swagger';
  import { SanitizedSportDto } from './dto/sanitized-sport.dto';
  
  @ApiTags('Sports')
  @Controller('sports')
  export class SportsController {
    constructor(private readonly sportsService: SportsService) {}
  
    @Get()
    @ApiOperation({
      summary: 'List all sports',
      description: 'Returns a list of all available sports in the system.',
    })
    @ApiOkResponse({
      description: 'List of sports',
      type: [SanitizedSportDto],
    })
    async findAll(): Promise<SanitizedSportDto[]> {
      const sports = await this.sportsService.findAll();
      return sports;
    }
  
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Create a new sport (Admin only)',
      description: 'Admin-only endpoint to create a new sport (e.g., Football, Basketball).',
    })
    @ApiCreatedResponse({
      description: 'Sport successfully created',
      type: SanitizedSportDto,
    })
    @ApiBody({
      type: CreateSportDto,
      description: 'Payload to create a new sport',
    })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can create sports' })
    async create(@Body() dto: CreateSportDto): Promise<SanitizedSportDto> {
      return this.sportsService.create(dto);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Update an existing sport (Admin only)',
      description: 'Admin-only endpoint to update the name of a sport by its ID.',
    })
    @ApiOkResponse({
      description: 'Sport updated successfully',
      type: SanitizedSportDto,
    })
    @ApiNotFoundResponse({ description: 'Sport not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can update sports' })
    @ApiParam({
      name: 'id',
      type: Number,
      description: 'ID of the sport to update',
    })
    @ApiBody({
      type: UpdateSportDto,
      description: 'New name for the sport',
    })
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateSportDto,
    ): Promise<SanitizedSportDto> {
      return this.sportsService.update(id, dto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({
      summary: 'Delete a sport (Admin only)',
      description: 'Admin-only endpoint to delete a sport by its ID.',
    })
    @ApiOkResponse({
      description: 'Sport deleted successfully',
      schema: {
        example: {
          message: 'Sport deleted successfully',
        },
      },
    })
    @ApiNotFoundResponse({ description: 'Sport not found' })
    @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
    @ApiForbiddenResponse({ description: 'Only admins can delete sports' })
    @ApiParam({
      name: 'id',
      type: Number,
      description: 'ID of the sport to delete',
    })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.sportsService.remove(id);
    }
  }
  