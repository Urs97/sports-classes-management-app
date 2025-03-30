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
  } from '@nestjs/swagger';
  import { SanitizedSportDto } from './dto/sanitized-sport.dto';
  
  @ApiTags('Sports')
  @Controller('sports')
  export class SportsController {
    constructor(private readonly sportsService: SportsService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get all sports' })
    @ApiOkResponse({ type: [SanitizedSportDto] })
    async findAll(): Promise<SanitizedSportDto[]> {
      const sports = await this.sportsService.findAll();
      return sports;
    }
  
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new sport (Admin only)' })
    @ApiCreatedResponse({ description: 'Sport created', type: SanitizedSportDto })
    @ApiBody({ type: CreateSportDto })
    async create(@Body() dto: CreateSportDto): Promise<SanitizedSportDto> {
      return this.sportsService.create(dto);
    }
  
    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a sport by ID (Admin only)' })
    @ApiOkResponse({ description: 'Sport updated', type: SanitizedSportDto })
    @ApiNotFoundResponse({ description: 'Sport not found' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({ type: UpdateSportDto })
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
    @ApiOperation({ summary: 'Delete a sport by ID (Admin only)' })
    @ApiOkResponse({ description: 'Sport deleted successfully' })
    @ApiNotFoundResponse({ description: 'Sport not found' })
    @ApiParam({ name: 'id', type: Number })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.sportsService.remove(id);
    }
  }
  