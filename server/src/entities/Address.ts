// Address.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    neighborhood: string;

    @Column()
    number: string;

    @Column()
    country: string;

    @Column()
    cep: string;

    @OneToOne(() => User, (user) => user.address)
    @JoinColumn()
    user: User;

    onDelete: "cascade";
}
