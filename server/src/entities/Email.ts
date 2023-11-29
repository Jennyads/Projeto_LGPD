import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity({ name: "email" })
export class Email {
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    // public userId: number

    @ManyToOne(() => User, (user) => user.email, {onDelete: 'CASCADE', eager:true})
    user: User
}