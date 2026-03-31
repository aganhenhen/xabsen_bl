import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  shiftCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'STAFF' })
  role: string;

}
