import { Profesional } from "src/profesional/entities/profesional.entity";
import { Column, ManyToMany, PrimaryGeneratedColumn, Entity, JoinTable } from "typeorm";

@Entity('profesion')
export class Profesion {
    
    @PrimaryGeneratedColumn()
    id_profesion: number

    @Column()
    nombre_profesion: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date
    
    @ManyToMany(() => Profesional, profesional => profesional.tipoProfesion)
    // @JoinTable()
    
    profesionales: Profesional[];
}
