import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('joueur') // Nom de votre table PostgreSQL (à ajuster)
export class JoueurEntity {
  @PrimaryGeneratedColumn() // ID auto-incrémenté (serial)
  id: number;

  // Ajoutez ici les autres colonnes de votre table (ex: valeur, date, etc.)
  @Column({ type: 'varchar', length: 50 })
  nom_prenom: string;

  // ... autres champs
}