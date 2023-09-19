import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Portafolio {
    
    @PrimaryGeneratedColumn()
    id_portafolio: number

    @Column()
    imagen: string

    @Column()
    descripcion: string

    @Column()
    certificaciones: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    

}