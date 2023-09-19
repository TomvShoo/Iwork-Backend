import { PartialType } from '@nestjs/mapped-types';
import { CreateCartaTrabajoDto } from './create-carta-trabajo.dto';

export class UpdateCartaTrabajoDto extends PartialType(CreateCartaTrabajoDto) {}
