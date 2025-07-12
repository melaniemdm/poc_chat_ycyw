CREATE TABLE utilisateur (
  id  integer PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe TEXT NOT NULL,
  date_naissance DATE,
  adresse TEXT,
  telephone VARCHAR(20)
);

CREATE TABLE agence (
  id  integer PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100),
  adresse TEXT,
  ville VARCHAR(100),
  code_postal VARCHAR(20),
  pays VARCHAR(100)
);

CREATE TABLE offre_location (
  id  integer PRIMARY KEY AUTO_INCREMENT,
  agence_depart_id integer,
  agence_retour_id integer,
  date_debut TIMESTAMP NOT NULL,
  date_fin TIMESTAMP NOT NULL,
  categorie_vehicule VARCHAR(10) NOT NULL,
  prix DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (agence_depart_id) REFERENCES agence(id),
  FOREIGN KEY (agence_retour_id) REFERENCES agence(id)
);

CREATE TABLE reservation (
  id  integer PRIMARY KEY AUTO_INCREMENT,
  utilisateur_id integer,
  offre_id integer,
  date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statut VARCHAR(20) CHECK (statut IN ('en_cours', 'confirmee', 'annulee')),
  total_prix DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id),
  FOREIGN KEY (offre_id) REFERENCES offre_location(id)
);

CREATE TABLE paiement (
  id integer PRIMARY KEY AUTO_INCREMENT,
  reservation_id integer,
  montant DECIMAL(10, 2) NOT NULL,
  statut VARCHAR(20) CHECK (statut IN ('en_attente', 'paye', 'echoue')),
  date_paiement TIMESTAMP,
  stripe_session_id TEXT,
  FOREIGN KEY (reservation_id) REFERENCES reservation(id)
);

