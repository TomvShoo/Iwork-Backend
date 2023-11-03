import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { PortafolioService } from './portafolio.service';
import { CreatePortafolioDto } from './dto/create-portafolio.dto';
import { ProfesionalService } from 'src/profesional/profesional.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UpdatePortafolioDto } from './dto/update-portafolio.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/rol.enum';

@UseGuards(RolesGuard)
@Controller('portafolio')
export class PortafolioController {
  constructor(private readonly portafolioService: PortafolioService,
              private readonly profesionalService: ProfesionalService,
              private readonly jwtService: JwtService,) {}

  @Get(':id')
  @Roles(Role.PROFESIONAL)
  async getPortafolio(@Param('id', ParseIntPipe) id: number) {
    const portafolio = await this.portafolioService.getPortafolio(id);
    if (!portafolio) {
      throw new NotFoundException(`Portafolio con el ID ${id} no encontrado`);
    }
    return portafolio;
  }

  @Post('upload')
  @Roles(Role.PROFESIONAL)
  async uploadFile(@Body() portafolioData: CreatePortafolioDto, @Req() req: Request) {
    try {
      const {authorization} = req.headers
      const token = authorization.split(' ') [1];
      const decodedToken = this.jwtService.decode(token);

      if (typeof decodedToken == 'string') {
        return {
          success: false,
          data: 'error en el token'
        };
      }

      const profesionalId = decodedToken.id
      const portafolio = {
        descripcion: portafolioData.descripcion,
        certificaciones: portafolioData.certificaciones,
        imagen: portafolioData.imagen,
      };

      const result = await this.portafolioService.createPortafolio(portafolio, profesionalId)
      return result;
    } catch (error) {
      console.log(error.message)
      throw new Error('No se pudo guardar la imagen')
    }
  }

  @Get('profesional/:id')
  @Roles(Role.PROFESIONAL)
  async getPortafoliosByProfesionalId(@Param('id') profesionalId: number) {
    try {
      const portafolios = await this.portafolioService.getPortafoliosByProfesionalId(profesionalId);
      return {
        success: true,
        data: portafolios,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Patch(':id')
  @Roles(Role.PROFESIONAL)
  updatePortafolio(@Param('id', ParseIntPipe) id: number, @Body() portafolio: UpdatePortafolioDto) {
    return this.portafolioService.updatePortafolio(id, portafolio);
  }
}