import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete, Patch, Req, Query, BadRequestException, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';
import {Request} from "express";
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Get()
    getUsers(): Promise<User[]> {
        return this.usersService.getUsers();
    }
    
    @Get(':id')
    @Roles(Role.CLIENTE, Role.ADMIN)
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUser(id);
    }


    @Post() 
    createUser(@Body() NewUser: CreateUserDto) {
        return this.usersService.createUser(NewUser)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deleteUser(id)
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body()
    user: UpdateUserDto) {
        return this.usersService.updateUser(id, user)
    }

    @Get('search')
    async searchProfessionals(@Query('query') query: string) {
        if (!query) {
        throw new BadRequestException('Please provide a valid search query.');
        }
        return this.usersService.searchUser(query.toString());
    }

    // @Get('frontend')
    // async frontend() {
    //     return this.usersService.all();
    // }

    // @Get('backend')
    // async backend(@Req() req: Request) {
    //     const builder = await this.usersService.queryBuilder('profesionales');

    //     if (req.query.s) {
    //         builder.where("products.title LIKE :s OR products.description LIKE :s", {s: `%${req.query.s}%`})
    //     }

    //     const sort: any = req.query.sort;

    //     if (sort) {
    //         builder.orderBy('products.price', sort.toUpperCase());
    //     }

    //     const page: number = parseInt(req.query.page as any) || 1;
    //     const perPage = 9;
    //     const total = await builder.getCount();

    //     builder.offset((page - 1) * perPage).limit(perPage);

    //     return {
    //         data: await builder.getMany(),
    //         total,
    //         page,
    //         last_page: Math.ceil(total / perPage)
    //     };
    // }

}
