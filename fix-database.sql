-- Script pour corriger les valeurs nulles dans la base de données
-- À exécuter avant d'activer synchronize: true

-- Corriger les valeurs nulles dans la colonne opponent de match_stats
UPDATE match_stats 
SET opponent = 'Unknown' 
WHERE opponent IS NULL;

-- Vérifier les autres colonnes qui pourraient avoir des valeurs nulles problématiques
-- Ajoutez d'autres corrections si nécessaire selon vos entités
