import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/rol.enum';

@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }
    
    @Get(':id')
    @Roles(Role.ADMIN)
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUser(id);
    }

    @Post() 
    createUser(@Body() NewUser: CreateUserDto) {
        return this.usersService.createUser(NewUser)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id)
    }

    @Patch(':id')
    @Roles(Role.CLIENTE, Role.ADMIN)
    updateUser(@Param('id', ParseIntPipe) id: number, @Body()
    user: UpdateUserDto) {
        return this.usersService.updateUser(id, user)
    }

    @Get('search')
    @Roles(Role.CLIENTE) 
    async searchProfessionals(@Query('query') query: string) {
        if (!query) {
        throw new BadRequestException('Please provide a valid search query.');
        }
        return this.usersService.searchUser(query.toString());
    }
}
