import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}