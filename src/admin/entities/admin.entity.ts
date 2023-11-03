import { Role } from "src/common/enums/rol.enum";
import { Reseña } from "src/reseña/entities/reseña.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string

    @Column()
    apellido: string
    
    @Column()
    nroTelefono: string

    @Column({ unique: true })
    correo: string;

    @Column()
    contrasena: string;

    @Column({ default: Role.ADMIN })
    tipoCuenta: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date;

    @OneToMany(() => Reseña, resena => resena.admin)
    resena: Reseña[];
}
