import { Profesional } from "src/profesional/entities/profesional.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'resena' })
export class Reseña {
    @PrimaryGeneratedColumn()
    resenaId: number;

    @Column({ nullable: true })
    calificacion: number;

    @Column({ nullable: true })
    resena: string;

    @ManyToOne(() => Profesional, profesional => profesional.resena)
    dueno: Profesional

    @ManyToOne(() => User, user => user.resena)
    escritor: User

    @Column({ nullable: false })
    userid: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date
}
