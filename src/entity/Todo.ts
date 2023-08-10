import {Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm"

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    todoName: string

    @Column({nullable: true, default: false})
    isChecked: boolean

    @UpdateDateColumn()
    checkedTime: Date
}