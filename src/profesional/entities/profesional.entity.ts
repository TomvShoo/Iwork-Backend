import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Portafolio } from "src/portafolio/entities/portafolio.entity";
import { CartaTrabajo } from "src/carta-trabajo/entities/carta-trabajo.entity";
import { Profesion } from "src/profesion/entities/profesion.entity";

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

    @Column({ nullable: false })
    contrasena: string

    @Column({ nullable: true })
    calificacion: number

    @Column( {nullable: true })
    resenas: string

    @Column()
    nroTelefono: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @OneToOne(() => Portafolio)
    @JoinColumn()
    portafolio: Portafolio

    @OneToMany(() => CartaTrabajo, carta => carta.author)
    cartas: CartaTrabajo[]

    @OneToMany(() => Profesion, profesion => profesion.dueno)
    tipoProfesion: Profesion[]
}