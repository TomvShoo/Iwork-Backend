import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('profesional')
export class profesional {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: true})
    calificacion: number

    @Column({nullable: true})
    resenas: string

    @Column()
    nroTelefono: number
}