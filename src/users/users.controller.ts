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
  import { User } from './entities/user.entity';
  import { AuthGuard } from '@nestjs/passport';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { UserRole } from './enums/user-role.enum';
  
  @Controller('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @Roles(UserRole.ADMIN)
    async create(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
      const user = await this.usersService.create(createUserDto);
      const { password, ...result } = user;
      return result;
    }
  
    @Get()
    @Roles(UserRole.ADMIN)
    async findAll(): Promise<Omit<User, 'password'>[]> {
      const users = await this.usersService.findAll();
      return users.map(({ password, ...result }) => result);
    }
  
    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.USER)
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Omit<User, 'password'>> {
      const user = await this.usersService.findOne(id);
      const { password, ...result } = user;
      return result;
    }
  
    @Put(':id')
    @Roles(UserRole.ADMIN)
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<Omit<User, 'password'>> {
      const user = await this.usersService.update(id, updateUserDto);
      const { password, ...result } = user;
      return result;
    }
  
    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
      await this.usersService.remove(id);
    }
  }
  