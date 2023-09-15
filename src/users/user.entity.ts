import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cliente' })
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    apellido: string

    @Column()
    genero: string

    @Column({ unique: true })
    correo: string

    @Column()
    contrasena: string

    @Column()
    fechanac: Date

}