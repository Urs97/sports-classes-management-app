import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/enums/user-role.enum';

import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportResponse } from './response/sport.response';
import { AbstractSportService } from './abstract/sport.abstract.service';

@ApiTags('Sports')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('sports')
export class SportController {
  constructor(private readonly sportService: AbstractSportService) {}

  @Get()
  @ApiOperation({
    summary: 'List all sports',
    description: 'Returns a list of all available sports in the system.',
  })
  @ApiOkResponse({
    description: 'List of sports',
    type: [SportResponse],
  })
  async findAll(): Promise<SportResponse[]> {
    return this.sportService.listSports();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new sport (Admin only)',
    description: 'Admin-only endpoint to create a new sport.',
  })
  @ApiCreatedResponse({
    description: 'Sport successfully created',
    type: SportResponse,
  })
  @ApiBody({
    type: CreateSportDto,
    description: 'Payload to create a new sport',
  })
  @ApiForbiddenResponse({ description: 'Only admins can create sports' })
  async create(@Body() dto: CreateSportDto): Promise<SportResponse> {
    return this.sportService.createSport(dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update an existing sport (Admin only)',
    description: 'Admin-only endpoint to update a sport by ID.',
  })
  @ApiOkResponse({
    description: 'Sport updated successfully',
    type: SportResponse,
  })
  @ApiNotFoundResponse({ description: 'Sport not found' })
  @ApiForbiddenResponse({ description: 'Only admins can update sports' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the sport to update',
  })
  @ApiBody({
    type: UpdateSportDto,
    description: 'New data for the sport',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSportDto,
  ): Promise<SportResponse> {
    return this.sportService.updateSport(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a sport (Admin only)',
    description: 'Admin-only endpoint to delete a sport by ID.',
  })
  @ApiNoContentResponse({ description: 'Sport deleted successfully' })
  @ApiNotFoundResponse({ description: 'Sport not found' })
  @ApiForbiddenResponse({ description: 'Only admins can delete sports' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the sport to delete',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.sportService.removeSport(id);
  }
}
