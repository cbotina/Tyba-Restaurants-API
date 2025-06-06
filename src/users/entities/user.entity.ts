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

  // Excluyo a la contraseña para no
  // mostrar informacion sensible
  @Exclude()
  @Column()
  password?: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.CUSTOMER,
  })
  role: Roles;
}
