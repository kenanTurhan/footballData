import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('match_stats') // Nom de votre table PostgreSQL (à ajuster)
export class MatchStatsEntity {
  @PrimaryGeneratedColumn() // ID auto-incrémenté (serial)
  id: number;

  // Ajoutez ici les autres colonnes de votre table (ex: valeur, date, etc.)
  @Column({ type: 'date' })
  match_date: Date;

  @Column({ type: 'text', nullable: true })
  opponent: string;

  @Column({ type: 'int' })
  goals: number;

  @Column({ type: 'int' })
  assists: number;

  @Column({ type: 'float' })
  xg: number;

  @Column({ type: 'float' })
  xa: number;

  @Column({ type: 'int' })
  player_id: number;

  @Column({ type: 'int' })
  idApi: number;

  // ... autres champs
}