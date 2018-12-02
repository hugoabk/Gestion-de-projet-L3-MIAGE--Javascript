# Gestion-de-projet-L3-MIAGE--Javascript
Gestion de projet (L3 MIAGE) - Réalisation d'un jeu en javascript

<h2>Système de jeu</h2>

À la manière d'un rail shooter classique, le joueur évolura en vue subjective. Le jeu se jouera donc en écran fixe où des ennemis apparaissent. Le joueur pourra tirer sur les ennemis et se mettre à couvert. Pour recharger, le joueur devra également se mettre à couvert. Le personnage possèdera des points de vie et il mourra si sa jauge atteint zéro. À la fin du niveau une  transition se fera automatiquement vers le niveau suivant.

Le jeu sera linéaire afin de pouvoir intéger un classement des meilleurs temps et des joueurs les plus précis. Il se composera de deux phases, celle classique avec des ennemis standards puis celle du Boss.

À la fin du jeu, le score du joueur (précision, vitesse…) et son classement seront affichés.

Les modules qui devront être développés :
- module "jeu principal"
- module de l'interface graphique
- module de gestion évènement souris / clavier
- module de sauvegarde des scores et classement

Les commandes sont les suivantes :
- Clic gauche de la souris -> Tirer
- Touche R -> Recharger
- Touche Ctrl -> Se mettre à couvert
