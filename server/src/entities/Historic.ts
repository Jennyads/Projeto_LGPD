import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "historic" })
export class Historic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 }) 
  action: string;

  @Column({ type: "datetime" })
  timestamp: Date;

  @Column({ type: "varchar", length: 20 })
  entityType: string;

}
