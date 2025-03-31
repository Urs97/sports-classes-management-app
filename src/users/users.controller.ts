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
  @ApiOperation({
    summary: 'Create a new user (Admin only)',
    description: 'Allows an admin to create a new user. Email must be unique.',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: SanitizedUserDto,
  })
  @ApiForbiddenResponse({
    description: 'Access denied: Only admins can create users',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User details including email, password, and role',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<SanitizedUserDto> {
    const user = await this.usersService.create(createUserDto);
    return sanitizeUser(user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'List all users (Admin only)',
    description: 'Returns a list of all registered users. Admin access only.',
  })
  @ApiOkResponse({
    description: 'Array of user objects',
    type: [SanitizedUserDto],
  })
  @ApiForbiddenResponse({
    description: 'Access denied: Only admins can view all users',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  async findAll(): Promise<SanitizedUserDto[]> {
    const users = await this.usersService.findAll();
    return users.map(sanitizeUser);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Get a user by ID',
    description:
      'Allows a user to fetch their own info, or an admin to fetch any user by ID.',
  })
  @ApiOkResponse({
    description: 'User found and returned successfully',
    type: SanitizedUserDto,
  })
  @ApiNotFoundResponse({
    description: 'User with the given ID was not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the user to retrieve',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<SanitizedUserDto> {
    const user = await this.usersService.findOne(id);
    return sanitizeUser(user);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Update a user (Admin only)',
    description: 'Allows admins to update user information by ID.',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: SanitizedUserDto,
  })
  @ApiNotFoundResponse({
    description: 'User with the given ID was not found',
  })
  @ApiForbiddenResponse({
    description: 'Access denied: Only admins can update users',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the user to update',
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Fields to update on the user',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SanitizedUserDto> {
    const user = await this.usersService.update(id, updateUserDto);
    return sanitizeUser(user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete a user (Admin only)',
    description: 'Allows admins to delete a user account by ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    schema: {
      example: {
        message: 'User deleted successfully',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'User with the given ID was not found',
  })
  @ApiForbiddenResponse({
    description: 'Access denied: Only admins can delete users',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access token',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the user to delete',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}

