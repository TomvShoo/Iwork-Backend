import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, JoinTable, ManyToMany } from "typeorm";
import { Portafolio } from "src/portafolio/entities/portafolio.entity";
import { CartaTrabajo } from "src/carta-trabajo/entities/carta-trabajo.entity";
import { Profesion } from "src/profesion/entities/profesion.entity";
import { Reseña } from "src/reseña/entities/reseña.entity";

@Entity('profesional')
export class Profesional {
    @PrimaryGeneratedColumn()
    profesionalId: number;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ unique: true })
    correo: string;

    @Column({ nullable: false })
    contrasena: string;

    @Column()
    nroTelefono: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @Column()
    tipoCuenta: string;

    @OneToOne(() => Portafolio, (portafolio) => portafolio.profesional)
    @JoinColumn()
    portafolio: Portafolio;

    @ManyToMany(() => Profesion, profesion => profesion.profesionId)
    @JoinTable()
    tipoProfesion: Profesion[];

    @OneToMany(() => Reseña, resena => resena.dueno)
    resena: Reseña[]
}