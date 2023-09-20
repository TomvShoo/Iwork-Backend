import { Profesional } from "src/profesional/entities/profesional.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm";

@Entity('carta_trabajo')
export class CartaTrabajo {
    @PrimaryGeneratedColumn()
    id_carta: number
    
    @Column()
    titulo: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

    @Column()
    id_profesional: number
    
    @ManyToOne(() => Profesional, profesional => profesional.cartas )
    author: Profesional

    @ManyToOne(() => User, cliente => cliente.cartas)
    read: User
}
