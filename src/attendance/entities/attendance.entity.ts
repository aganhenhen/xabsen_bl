import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('attendance')
@Unique(['user', 'checkin_date']) // Sinkron dengan constraint unique_user_date
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'date', name: 'checkin_date', default: () => 'CURRENT_DATE' })
  checkin_date: string;

  @Column({ type: 'timestamptz', name: 'check_in', default: () => 'CURRENT_TIMESTAMP' })
  check_in: Date;

  @Column({ type: 'timestamptz', name: 'check_out', nullable: true })
  check_out: Date;

  @Column({ length: 20, default: 'PRESENT' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'check_in_coordinate', nullable: true })
  check_in_coordinate: string;

  @Column({ name: 'check_out_coordinate', nullable: true })
  check_out_coordinate: string;

  @Column({ name: 'check_in_addr', nullable: true })
  check_in_addr: string;

  @Column({ name: 'check_out_addr', nullable: true })
  check_out_addr: string;
}