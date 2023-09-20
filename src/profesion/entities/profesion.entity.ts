import { Profesional } from "src/profesional/entities/profesional.entity";
import { Column, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class Profesion {
    
    @PrimaryGeneratedColumn()
    id_profesion: number

    @Column()
    nombre_profesion: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @ManyToOne(() => Profesional, profesional => profesional.tipoProfesion)
    dueno: Profesional
}
