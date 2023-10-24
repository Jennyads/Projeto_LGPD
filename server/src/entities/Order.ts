import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Product } from "./Product"
import { User } from "./User"

@Entity({ name: "order" })
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    // @Column()
    // public userId: number

    @ManyToOne(() => Product, (product) => product.order, {onDelete: 'CASCADE', eager:true})
    product: Product

    @ManyToOne(() => User, (user) => user.order, {onDelete: 'CASCADE', eager:true})
    user: User
}