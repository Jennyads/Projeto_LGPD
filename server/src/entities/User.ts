import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { Product } from "./Product";
import { Order } from "./Order";


@Entity({name:"user"})
export class User {
    // define a chave primária como auto incremento
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 25})
    userName: string;

    @Column({nullable: false, length: 25})
    userCpf: string;

    @Column({nullable: false, length: 25})
    userEmail: string;

    @Column({nullable: false, length: 70})
    userAddress: string;

    @OneToMany(() => Order, (order) => order.user)
    order: Order[];

}
