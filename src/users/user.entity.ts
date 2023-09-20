import { CartaTrabajo } from "src/carta-trabajo/entities/carta-trabajo.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

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

    @Column()
    contrasena: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @OneToMany(() => CartaTrabajo, carta => carta.author)
    cartas: CartaTrabajo[]
}