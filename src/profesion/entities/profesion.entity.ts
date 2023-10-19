import { Profesional } from "src/profesional/entities/profesional.entity";
import { Column, ManyToMany, ManyToOne, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity('profesion')
export class Profesion {
    
    @PrimaryGeneratedColumn()
    id_profesion: number

    @Column()
    nombre_profesion: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @ManyToOne(() => Profesional, profesional => profesional.tipoProfesion)
    dueno: Profesional

    @ManyToMany(() => Profesional, profesional => profesional.tipoProfesion)
    profesionId: Profesional[];
}
