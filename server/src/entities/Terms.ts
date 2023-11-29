import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({name:"terms"})

export class Terms {
    // define a chave primária como auto incremento
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 25})
    versionDescription: string;

    // @ManyToOne(() => User, (user) => user.order, {onDelete: 'CASCADE', eager:true})
    // userId: User

    @Column({nullable: false, length: 25})
    userApplied: boolean;

    @Column({ type: "datetime" })
    dateApplied: Date;

    @ManyToOne(() => User, (user) => user.email, {onDelete: 'CASCADE', eager:true})
    user: User;

    // @ManyToOne(() => User, (user) => user.contact, {onDelete: 'CASCADE', eager:true})
    // user: User;

}