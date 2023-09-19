import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Portafolio } from "src/portafolio/entities/portafolio.entity";

@Entity('profesional')
export class Profesional {
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

    @Column({nullable: true})
    calificacion: number

    @Column({nullable: true})
    resenas: string

    @Column()
    nroTelefono: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @OneToOne(() => Portafolio)
    @JoinColumn()
    portafolio: Portafolio
}