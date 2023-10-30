import { Role } from "src/common/enums/rol.enum";
import { Reclamo } from "src/reclamo/entities/reclamo.entity";
import { Reseña } from "src/reseña/entities/reseña.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    correo: string;

    @Column()
    contrasena: string;

    @Column({ default: Role.ADMIN })
    tipoCuenta: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date;

    @OneToMany(() => Reseña, resena => resena.admin)
    resenas: Reseña[];
}
