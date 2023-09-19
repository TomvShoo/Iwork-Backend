import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Profesion {
    
    @PrimaryGeneratedColumn()
    id_profesion: number

    @Column()
    nombre_profesion: string

    @Column()
    
    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

}
