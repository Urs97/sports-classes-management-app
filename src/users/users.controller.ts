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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SanitizedUserDto } from './dto/sanitized-user.dto';
import { sanitizeUser } from './utils/user.utils';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: SanitizedUserDto,
  })
  @ApiForbiddenResponse({ description: 'Only admins can create users' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<SanitizedUserDto> {
    const user = await this.usersService.create(createUserDto);
    return sanitizeUser(user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiOkResponse({
    description: 'List of all users',
    type: [SanitizedUserDto],
  })
  @ApiForbiddenResponse({ description: 'Only admins can access this resource' })
  async findAll(): Promise<SanitizedUserDto[]> {
    const users = await this.usersService.findAll();
    return users.map(sanitizeUser);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiOkResponse({ description: 'User found', type: SanitizedUserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiParam({ name: 'id', type: Number })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SanitizedUserDto> {
    const user = await this.usersService.findOne(id);
    return sanitizeUser(user);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user by ID (Admin only)' })
  @ApiOkResponse({ description: 'User updated', type: SanitizedUserDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Only admins can update users' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUserDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return sanitizeUser(user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Only admins can delete users' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
