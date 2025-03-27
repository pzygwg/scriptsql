# ScriptSQL

Un outil minimaliste pour transformer vos documents en requêtes SQL. Cette application permet d'extraire automatiquement des données structurées à partir de divers formats de documents et de générer des instructions SQL INSERT correspondantes.

## Caractéristiques

- **Interface utilisateur épurée**: Design minimaliste en noir et blanc avec une esthétique ASCII art
- **Extraction intelligente de données**: Utilise l'IA pour comprendre et extraire des données structurées
- **Support multi-formats**: Traite une variété de formats de documents (PDF, DOCX, DOC, TXT, HTML, etc.)
- **Personnalisation des tables SQL**: Définissez vos propres schémas de tables SQL
- **Choix de fournisseurs d'IA**: Sélectionnez entre Claude (Anthropic) et DeepSeek

## Architecture

### Frontend
- React avec Styled Components
- Design responsive et minimaliste
- Icônes Lucide pour une interface légère
- Thème clair/sombre
- Animations ASCII pour les chargements et le logo

### Backend
- Serveur Node.js avec Express
- Traitement de documents multi-formats
- Intégration avec APIs d'IA (Claude et DeepSeek)
- Système de fichiers pour stocker temporairement les documents

## Formats de documents pris en charge

- **PDF**: Extraction complète du texte
- **Word**: Formats DOCX (moderne) et DOC (ancien)
- **Text**: TXT, HTML, Markdown
- **Images**: PNG, JPG, GIF, etc. (métadonnées et références uniquement)
- **Apple Pages**: Extraction du contenu texte

## Installation

### Prérequis
- Node.js (v14 ou plus)
- npm ou yarn

### Installation
```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/scriptsql.git
cd scriptsql

# Installer les dépendances du serveur
cd server
npm install

# Installer les dépendances du client
cd ../client
npm install
```

### Configuration
Créez un fichier `.env` dans le dossier `server` basé sur `.env.example` :
```
PORT=5000
CLAUDE_API_KEY=votre-clé-api-claude
DEEPSEEK_API_KEY=votre-clé-api-deepseek
```

## Exécution

```bash
# Démarrer le serveur (depuis le dossier racine)
cd server
npm start

# Démarrer le client (dans un nouveau terminal, depuis le dossier racine)
cd client
npm run dev
```

Le client sera accessible à `http://localhost:3000` (ou un autre port si le 3000 est déjà utilisé).
Le serveur API sera exécuté sur `http://localhost:5000`.

## Utilisation

### 1. Définition des tables SQL
Commencez par définir vos tables SQL en utilisant la syntaxe CREATE TABLE standard. Vous pouvez soit:
- Utiliser l'exemple fourni
- Écrire vos propres définitions de tables
- Effacer et recommencer

### 2. Téléchargement de documents
Téléchargez les documents à partir desquels vous souhaitez extraire des données:
- Glissez-déposez les fichiers
- Utilisez le bouton de téléchargement
- Formats supportés: PDF, DOCX, DOC, TXT, HTML, Markdown, images, etc.

### 3. Traitement avec IA
Choisissez un fournisseur d'IA pour traiter vos documents:
- **Claude**: Excellent pour comprendre des documents complexes
- **DeepSeek**: Optimisé pour l'extraction d'informations

### 4. Résultats SQL
Visualisez les instructions SQL INSERT générées:
- Copiez le code SQL en un clic
- Utilisez directement dans votre base de données
- Recommencez avec de nouveaux documents ou tables

## Fonctionnalités de l'interface

- **Mode sombre/clair**: Basculez entre les thèmes avec l'icône dans l'en-tête
- **Logo chat ASCII**: Animation ASCII minimaliste dans l'en-tête
- **Animation de chargement**: Chat ASCII animé pendant le traitement
- **Design minimaliste**: Interface épurée, noir et blanc
- **Sections rétractables**: Certaines informations sont masquées par défaut pour une meilleure lisibilité

## Problèmes connus et limites

- L'analyse d'images se limite aux métadonnées (pas d'OCR)
- Les fichiers très volumineux peuvent prendre du temps à traiter
- Les API d'IA peuvent occasionnellement donner des résultats imprécis
- La qualité de l'extraction dépend de la structure des documents

## Développement

### Structure du projet
```
scriptsql/
├── client/                 # Frontend React
│   ├── public/             # Fichiers statiques
│   └── src/                # Code source React
│       ├── components/     # Composants React
│       ├── context/        # Contextes React (thème, etc.)
│       └── styles/         # Fichiers CSS et styles
├── server/                 # Backend Node.js
│   ├── src/                # Code source du serveur
│   │   ├── controllers/    # Contrôleurs Express
│   │   ├── routes/         # Routes API
│   │   ├── services/       # Services (IA, documents)
│   │   └── utils/          # Utilitaires
│   └── uploads/            # Dossier de téléchargements temporaire
└── README.md               # Documentation
```

## Contributions

Les contributions sont les bienvenues. Veuillez suivre ces étapes:
1. Forker le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Committer vos changements (`git commit -m 'Add some amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## Remerciements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [DeepSeek](https://www.deepseek.com/)
- [Lucide Icons](https://lucide.dev/)
- [Styled Components](https://styled-components.com/)
- Bibliothèques de traitement de documents: pdf-parse, mammoth, textract, et autres
