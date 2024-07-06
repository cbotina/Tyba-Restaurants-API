import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer/';

export enum Roles {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity('user_table')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password?: string;

  @Column({ default: 0 })
  balance?: number;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.CUSTOMER,
  })
  role: Roles;
}
