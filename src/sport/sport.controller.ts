import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiPaginatedResponse } from '../common/decorators/paginated-resource.decorator';
import { Paginated } from '../common/dto/pagination/paginated.dto';
import { PaginationOptionsDto } from '../common/dto/pagination/pagination-options.dto';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/enums/user-role.enum';

import { CreateSportDto } from './dto/create-sport.dto';
import { UpdateSportDto } from './dto/update-sport.dto';
import { SportResponse } from './response/sport.response';
import { AbstractSportService } from './abstract/sport.abstract.service';
import { NumberIdDto } from '../common/dto/number-id.dto';

@ApiTags('Sports')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('sports')
export class SportController {
  constructor(private readonly sportService: AbstractSportService) {}

  @Get()
  @ApiPaginatedResponse(SportResponse)
  @ApiOperation({
    summary: 'List all sports',
    description: 'Returns a paginated list of all available sports in the system.',
  })
  async findAll(
    @Query() paginationOptionsDto: PaginationOptionsDto,
  ): Promise<Paginated<SportResponse>> {
    return this.sportService.listSports(paginationOptionsDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create a new sport (Admin only)',
    description: 'Admin-only endpoint to create a new sport.',
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
  @ApiNotFoundResponse({ description: 'Sport not found' })
  @ApiForbiddenResponse({ description: 'Only admins can update sports' })
  async update(
    @Param() { id }: NumberIdDto,
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
  async remove(@Param() { id }: NumberIdDto): Promise<void> {
    await this.sportService.removeSport(id);
  }
}
