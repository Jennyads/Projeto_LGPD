import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "./Product"
import { User } from "./User"
import { Terms } from "./Terms"

@Entity({ name: "userTerms" })
export class UserTerms {
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    // public userId: number

    @ManyToOne(() => Terms, (terms) => terms.userTerms, {onDelete: 'CASCADE', eager:true})
    terms: Terms

    @ManyToOne(() => User, (user) => user.userTerms, {onDelete: 'CASCADE', eager:true})
    user: User
}