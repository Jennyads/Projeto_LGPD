import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity({ name: "Contact" })
export class Contact {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false, length: 25})
    phone: string;

    @Column({nullable: false, length: 40})
    email: string;


    @OneToOne(() => User, (user) => user.contact, {onDelete: 'CASCADE', eager:true})
    user: User
}