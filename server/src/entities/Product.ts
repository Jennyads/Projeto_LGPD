import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn } from "typeorm";

@Entity({name:"product"})
export class Product {
    // define a chave primária como auto incremento
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, length: 25})
    prodTitle: string;

    @Column({nullable: false, length: 80})
    prodDescription: string;

    @Column({nullable: false, length: 10})
    prodPrice: string;


}
