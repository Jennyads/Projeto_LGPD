import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { Order } from "./Order";
import { Contact } from "./Contact";
import { Email } from "./Email";

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

    // @Column({nullable: false, length: 70})
    // userAddress: string;

    @Column({ name: 'DateCreate' })
    DateCreate: Date;

    @OneToMany(() => Email, (email) => email.user)
    email: Email[];

    @OneToMany(() => Contact, (contact) => contact.user)
    contact: Contact[];
    
    @OneToMany(() => Order, (order) => order.user)
    order: Order[];

}