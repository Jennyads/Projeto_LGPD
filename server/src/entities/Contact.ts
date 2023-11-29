import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "./User"

@Entity({ name: "Contact" })
export class Contact {
    @PrimaryGeneratedColumn()
    id: number

    // @ManyToOne(() => Product, (product) => product.order, {onDelete: 'CASCADE', eager:true})
    // product: Product

    @ManyToOne(() => User, (user) => user.contact, {onDelete: 'CASCADE', eager:true})
    user: User
}