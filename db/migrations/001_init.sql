-- ============================================
-- Schéma complet — Los Leones MMA
-- ============================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ADMIN
-- ============================================
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    mail TEXT UNIQUE NOT NULL,
    mdp TEXT NOT NULL,              -- toujours un HASH (bcrypt), jamais le mot de passe en clair
    tel TEXT,
    photo TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- DEMANDE
-- ============================================
CREATE TABLE demande (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code TEXT UNIQUE,     -- ex: LL-2026-00124, généré via trigger (cf. plus bas)
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    tel TEXT NOT NULL,
    mail TEXT,
    date_naissance DATE NOT NULL,
    ville TEXT,
    a_experience_combat BOOLEAN NOT NULL DEFAULT false,
    experience_niveau TEXT
        CHECK (experience_niveau IN ('debutant', 'intermediaire', 'avance', 'professionnel')),
    annee_experience INTEGER,
    motivation TEXT,
    photo TEXT,
    comment_connu TEXT
        CHECK (comment_connu IN ('instagram', 'tiktok', 'facebook', 'whatsapp', 'recommandation', 'google', 'autre')),
    status TEXT NOT NULL DEFAULT 'en_attente_paiement'
        CHECK (status IN ('en_attente_paiement', 'paye', 'approuve', 'refuse')),
    reviewed_by UUID REFERENCES admin(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Génération automatique du reference_code (LL-2026-00001, etc.)
CREATE SEQUENCE IF NOT EXISTS demande_ref_seq START 1;

CREATE OR REPLACE FUNCTION generate_demande_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference_code := 'LL-' || EXTRACT(YEAR FROM now()) || '-' ||
    LPAD(nextval('demande_ref_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_demande_reference
  BEFORE INSERT ON demande
  FOR EACH ROW
  EXECUTE FUNCTION generate_demande_reference();

-- ============================================
-- PAYMENT
-- ============================================
CREATE TABLE payment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demande_id UUID UNIQUE NOT NULL REFERENCES demande(id) ON DELETE CASCADE,
    -- UNIQUE ci-dessus = au maximum 1 paiement par demande (conforme à ton schéma 0..1)
    statut TEXT NOT NULL DEFAULT 'initie'
        CHECK (statut IN ('initie', 'reussi', 'echoue')),
    montant INTEGER NOT NULL,       -- en FCFA
    fournisseur TEXT
        CHECK (fournisseur IN ('wave', 'orange_money', 'carte')),
    ref_transaction TEXT,           -- ID renvoyé par PayTech/Wave, preuve de transaction
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMPTZ
);

-- ============================================
-- FIGHTER
-- ============================================
CREATE TABLE fighter (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    demande_id UUID UNIQUE REFERENCES demande(id) ON DELETE SET NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    surnom TEXT,                    -- nickname, ex: "The Lion"
    weight_category TEXT,           -- catégorie de poids (absente de ton schéma, ajoutée par défaut)
    niveau TEXT
        CHECK (niveau IN ('debutant', 'intermediaire', 'avance', 'professionnel')),
    reseaux TEXT,                   -- ex: lien Instagram
    combat INTEGER NOT NULL DEFAULT 0,
    victoire INTEGER NOT NULL DEFAULT 0,
    defaite INTEGER NOT NULL DEFAULT 0,
    nul INTEGER NOT NULL DEFAULT 0,
    ko INTEGER NOT NULL DEFAULT 0,
    soumission INTEGER NOT NULL DEFAULT 0,
    apropos TEXT,
    style_de_combat TEXT,
    palmares TEXT,
    bio TEXT,
    photo TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ARTICLE
-- ============================================
CREATE TABLE article (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auteur_id UUID REFERENCES admin(id) ON DELETE SET NULL,
    titre TEXT NOT NULL,
    contenu TEXT NOT NULL,
    date_publication TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'publie')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ARTICLE <-> FIGHTER (relation N:N)
-- ============================================
CREATE TABLE article_fighter (
    article_id UUID NOT NULL REFERENCES article(id) ON DELETE CASCADE,
    fighter_id UUID NOT NULL REFERENCES fighter(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, fighter_id)
);

-- ============================================
-- INDEX
-- ============================================
CREATE INDEX idx_demande_status ON demande(status);
CREATE INDEX idx_demande_reference_code ON demande(reference_code);
CREATE INDEX idx_payment_demande_id ON payment(demande_id);
CREATE INDEX idx_fighter_is_active ON fighter(is_active);
CREATE INDEX idx_article_status_date ON article(status, date_publication DESC);