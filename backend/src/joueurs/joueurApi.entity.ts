import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('joueurApi')
export class JoueurApiEntity {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  apiPlayerId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  team: string;

  @Column({ nullable: true })
  position: string;

  @Column({ nullable: true })
  injured: boolean;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  appearances: number;

  @Column({ nullable: true })
  goals: number;

  @Column({ nullable: true })
  assists: number;

  @Column({ nullable: true })
  shoot: number;

  @Column({ nullable: true })
  keyPasses: number;

  @Column({ nullable: true })
  dribblesSuccess: number;
  
  @Column({ nullable: true })
  duelsWon: number;



  
}
