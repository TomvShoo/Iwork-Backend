import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

Entity('email')
export class Email {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    recipient: string;

    @Column()
    subject: string;

    @Column()
    message: string;
}
