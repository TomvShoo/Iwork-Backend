import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export class Reclamo {
    @PrimaryGeneratedColumn()
    reclamoId: number;
    
    @Column()
    reclamo: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    CreatedAt: Date

}
