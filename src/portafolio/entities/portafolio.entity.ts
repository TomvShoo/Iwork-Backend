import { Profesional } from "../../profesional/entities/profesional.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";

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

    @OneToOne(() => Profesional, (profesional) => profesional.portafolio)
    @JoinColumn()
    profesional: Profesional

    // @OneToOne(() => Profesional)
    // @JoinColumn({ name: 'profesionalId', referencedColumnName: 'profesionalId' })
    // profesional: Profesional;
    
    @Column({ nullable: false })
    profesionalId: number;
}