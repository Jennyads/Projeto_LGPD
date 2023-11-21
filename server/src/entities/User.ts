import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { Order } from "./Order";
import { Address } from "./Address";
import { PhoneNumber } from "./PhoneNumber";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, length: 25 })
    userName: string;

    @Column({ nullable: false, length: 25 })
    userCpf: string;

    @Column({ nullable: false, length: 255 })
    userEmail: string;

    @Column({ name: 'DateCreate' })
    dateCreate: Date;

    @OneToOne(() => Address, { lazy: true })
    @JoinColumn()
    address: Address;

    @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.user, { cascade: true, eager: false })
    phoneNumbers: PhoneNumber[];

    @OneToMany(() => Order, (order) => order.user)
    order: Order[];
}
