import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Order } from "./Order";
import { Contact } from "./Contact";
import { UserTerms } from "./UserTerms";
import { Address } from "./Address";

@Entity({name:"user"})
export class User {
    // define a chave primária como auto incremento
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 25})
    userName: string;

    @Column({nullable: false, length: 25})
    userCpf: string;

    @Column({ name: 'DateCreate' })
    DateCreate: Date;

    @OneToOne(() => Contact, (contact) => contact.user)
    @JoinColumn()
    contact: Contact[];

    @OneToOne(() => Address, (address) => address.user)
    @JoinColumn()
    address: Address[];

    
    @OneToMany(() => Order, (order) => order.user)
    order: Order[];

    @OneToMany(() => UserTerms, (userTerms) => userTerms.user)
    userTerms: UserTerms[];

}