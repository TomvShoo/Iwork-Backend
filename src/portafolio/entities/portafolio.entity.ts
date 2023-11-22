import { Profesional } from "../../profesional/entities/profesional.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, JoinTable } from "typeorm";

@Entity()
export class Portafolio {
    
    @PrimaryGeneratedColumn()
    id_portafolio: number

    @Column( "longtext",{ nullable: true })
    imagen: string;

    @Column({ nullable: true })
    descripcion: string

    @Column({ nullable: true })
    certificaciones: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @OneToOne(() => Profesional, (profesional) => profesional.portafolio) // id de portafolio puede 
    profesional: Profesional
    
    @Column({ nullable: false })
    profesionalId: number;
}