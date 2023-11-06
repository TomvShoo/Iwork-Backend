import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Portafolio } from "src/portafolio/entities/portafolio.entity";
import { CartaTrabajo } from "src/carta-trabajo/entities/carta-trabajo.entity";
import { Profesion } from "src/profesion/entities/profesion.entity";
import { Reseña } from "src/reseña/entities/reseña.entity";
import { Role } from "src/common/enums/rol.enum";

@Entity('profesional')
export class Profesional {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({ default: Role.PROFESIONAL})
    tipoCuenta: string;

    @OneToOne(() => Portafolio, (portafolio) => portafolio.profesional, { cascade: true })
    @JoinColumn()
    portafolio: Portafolio;

    @ManyToMany(() => Profesion, profesion => profesion.profesionales, { cascade: true })
    @JoinTable()
    tipoProfesion: Profesion[];

    addProfesion(profesion: Profesion) {
        if (!this.tipoProfesion) {
            this.tipoProfesion = [];
        }
        this.tipoProfesion.push(profesion);
    }

    @OneToMany(() => Reseña, resena => resena.dueno, { cascade: true })
    resena: Reseña[]
}