import { CartaTrabajo } from "src/carta-trabajo/entities/carta-trabajo.entity";
import { Role } from "../common/enums/rol.enum";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Reseña } from "src/reseña/entities/reseña.entity";
import { Reclamo } from "src/reclamo/entities/reclamo.entity";

@Entity({ name: 'cliente' })
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    apellido: string

    @Column({ unique: true })
    correo: string

    @Column({ nullable: false })
    contrasena: string

    @Column()
    nroTelefono: string

    @Column({ default: Role.CLIENTE})
    tipoCuenta: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @OneToMany(() => Reseña, resena => resena.escritor)
    resena: Reseña[]
}