// PhoneNumber.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class PhoneNumber {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ddd: string

    @Column()
    number: string

    @ManyToOne(() => User, (user) => user.phoneNumbers)
    user: User;

    

}
