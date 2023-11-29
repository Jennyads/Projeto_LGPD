import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserTerms } from "./UserTerms";

@Entity({name:"terms"})

export class Terms {
    // define a chave primária como auto incremento
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 25})
    versionDescription: string;

    // @ManyToOne(() => User, (user) => user.order, {onDelete: 'CASCADE', eager:true})
    // userId: User

    @Column({nullable: false})
    userApplied: boolean;

    @Column({ type: "datetime" })
    dateApplied: Date;

    @OneToMany(() => UserTerms, (userTerms) => userTerms.terms)
    userTerms: UserTerms[];

}