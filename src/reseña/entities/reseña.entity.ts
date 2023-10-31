import { Admin } from "src/admin/entities/admin.entity";
import { Profesional } from "src/profesional/entities/profesional.entity";
import { Reclamo } from "src/reclamo/entities/reclamo.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TipoResena {
    Comentario = "comentario",
    Reclamo = "reclamo"
}

@Entity({ name: 'resena' })
export class Reseña {
    @PrimaryGeneratedColumn()
    resenaId: number;

    @Column({ nullable: true })
    calificacion: number;

    @Column("longtext",{ nullable: true })
    resena: string;

    @Column({ type: "enum", enum: TipoResena})
    tipo: TipoResena;

    @ManyToOne(() => Profesional, profesional => profesional.resena)
    dueno: Profesional

    @ManyToOne(() => User, user => user.resena)
    escritor: User

    @ManyToOne(() => Admin, admin => admin.resena)
    admin: Admin;

    @Column({ nullable: false })
    userid: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

}
