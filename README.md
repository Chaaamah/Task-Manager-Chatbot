
# Mini-Projet 2 : Chatbot de gestion des tâches

## Objectif du projet
Ce projet a pour objectif de créer une application web dotée d’un **chatbot intelligent**, conçu pour accompagner les utilisateurs dans la gestion de leurs tâches quotidiennes. Le chatbot permettra d’interagir de manière dynamique pour ajouter, modifier ou supprimer des tâches, tout en proposant des recommandations pour organiser les priorités et envoyer des rappels automatiques pour les échéances imminentes. L’utilisation de **Tailwind CSS** assurera une interface utilisateur moderne, intuitive et élégante.

---

## Fonctionnalités principales

### 1. Gestion des tâches via le chatbot
- Ajout de nouvelles tâches en interagissant avec le chatbot.
- Modification des tâches existantes via des commandes naturelles.
- Suppression des tâches complétées ou inutiles.
- Suggestions automatiques pour organiser les priorités.

### 2. Notifications et rappels
- Rappels automatiques pour les tâches à échéance proche.
- Notifications basées sur l'urgence ou l'importance des tâches.

### 3. Tableau de bord des tâches
- Vue d’ensemble des tâches avec leur statut (en cours, terminé, etc.).
- Filtrage et recherche des tâches par priorité ou par date.

---

## Guide d’installation et d’exécution

### Prérequis
- Node.js et npm installés.
- MongoDB opérationnel.
- Docker (optionnel pour le déploiement).

### Étapes d'installation
1. **Cloner le repository** :
   ```bash
   git clone https://github.com/Chaaamah/Task-Manager-Chatbot.git
   cd Task-Manager-Chatbot
   ```

2. **Configurer le backend** :
   ```bash
   cd backend
   npm install
   ```
   Créez un fichier `.env` et configurez les variables d'environnement :
   ```env
   PORT=5000
   MONGO_URI=<votre-uri-mongodb>
   JWT_SECRET=<votre-secret>
   ```

3. **Configurer le frontend** :
   ```bash
   cd ../frontend
   npm install
   ```

4. **Lancer l'application** :
   - Backend : `npm start` (depuis le dossier backend).
   - Frontend : `npm start` (depuis le dossier frontend).

---

## Explication des APIs

### Gestion des utilisateurs
- **POST /users/register** : Enregistrer un nouvel utilisateur.
  - Payload : `{ "nom": "string", "email": "string", "password": "string" }`
  - Réponse : `{ "message": "Utilisateur enregistré avec succès." }`
- **POST /users/login** : Authentification utilisateur.
  - Payload : `{ "email": "string", "password": "string" }`
  - Réponse : `{ "token": "string" }`

### Gestion des tâches
- **POST /tasks** : Ajouter une nouvelle tâche.
  - Payload : `{ "titre": "string", "description": "string", "date": "date", "priorité": "string", "statut": "string" }`
  - Réponse : `{ "message": "Tâche ajoutée avec succès." }`
- **GET /tasks** : Obtenir la liste des tâches.
  - Réponse : `[{ "id": "string", "titre": "string", "description": "string", ... }]`
- **GET /tasks/:id** : Obtenir les détails d'une tâche.
  - Réponse : `{ "id": "string", "titre": "string", "description": "string", ... }`
- **PATCH /tasks/:id** : Modifier une tâche existante.
  - Payload : `{ "titre": "string", "description": "string", ... }`
  - Réponse : `{ "message": "Tâche mise à jour avec succès." }`
- **DELETE /tasks/:id** : Supprimer une tâche.
  - Réponse : `{ "message": "Tâche supprimée avec succès." }`

---

## Contribution
Les contributions sont les bienvenues ! Veuillez suivre les étapes suivantes :
1. Forker le repository.
2. Créer une branche : `git checkout -b feature/ma-nouvelle-fonctionnalite`.
3. Committer vos modifications : `git commit -m "Ajout d'une nouvelle fonctionnalité"`.
4. Pousser vos modifications : `git push origin feature/ma-nouvelle-fonctionnalite`.
5. Créer une pull request.

---

## Auteur
Projet réalisé sous la supervision de **AGOUMI Chaima & BOUANGA Nelle Kelly**.

---

## Licence
Ce projet est sous licence MIT. Consultez le fichier `LICENSE` pour plus de détails.
