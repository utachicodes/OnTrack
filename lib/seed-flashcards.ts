import type { TrackId } from './bac-curriculum'

/**
 * Starter flashcards per chapter. Used when a user first opens a track
 * so the review deck is not empty. Each card has a short front (the
 * prompt) and a slightly longer back (the answer / mnemonic).
 */

export interface SeedCard { front: string; back: string }

export const SEED_FLASHCARDS: Record<TrackId, Record<string, SeedCard[]>> = {
  maths: {
    'ma-suites': [
      { front: 'Suite arithmétique u_{n+1} = u_n + r, somme des n premiers termes ?', back: 'S_n = n·(u_0 + u_{n-1})/2 = n·(2·u_0 + (n-1)·r)/2' },
      { front: 'Suite géométrique u_{n+1} = q·u_n, somme ?', back: 'Si q≠1 : S_n = u_0·(1 − q^n)/(1 − q)' },
      { front: 'Théorème de convergence monotone', back: 'Toute suite croissante et majorée converge.' },
    ],
    'ma-derivation': [
      { front: 'Dérivée de exp(x)', back: 'exp(x) (elle-même).' },
      { front: 'Dérivée de ln(x)', back: '1/x.' },
      { front: 'Dérivée de x^n', back: 'n·x^{n−1}.' },
      { front: 'Dérivée de u·v', back: 'u′·v + u·v′.' },
      { front: 'Dérivée de u/v', back: '(u′·v − u·v′) / v².' },
    ],
    'ma-integrale': [
      { front: 'Primitive de 1/x', back: 'ln|x| + C.' },
      { front: 'Primitive de u′·u', back: 'u²/2 + C.' },
      { front: 'Primitive de exp(x)', back: 'exp(x) + C.' },
      { front: 'Théorème fondamental', back: '∫_a^b f = F(b) − F(a) où F′ = f.' },
    ],
    'ma-probabilites-cond': [
      { front: 'P(A∩B) si A et B indépendants ?', back: 'P(A)·P(B).' },
      { front: 'Formule de Bayes', back: 'P_B(A) = P(A∩B)/P(B).' },
      { front: 'Probabilités totales', back: 'P(A) = Σ P(B_i)·P_{B_i}(A).' },
    ],
    'ma-lois': [
      { front: 'Espérance de B(n, p)', back: 'E(X) = n·p.' },
      { front: 'Variance de B(n, p)', back: 'V(X) = n·p·(1−p).' },
      { front: 'Intervalle de fluctuation 95%', back: '[p − 1/√n, p + 1/√n].' },
    ],
    'ma-echantillonnage': [
      { front: 'Intervalle de confiance 95%', back: '[f − 1/√n, f + 1/√n].' },
      { front: 'Décision statistique', back: 'Si p_0 ∉ IC → on rejette l\'hypothèse au seuil 5%.' },
    ],
    'ma-produit-scalaire': [
      { front: 'u·v avec angles', back: 'u·v = |u||v|cos(θ).' },
      { front: 'Condition d\'orthogonalité', back: 'u·v = 0 ⇔ u ⊥ v.' },
    ],
  },
  physique: {
    'ph-newton': [
      { front: '2ᵉ loi de Newton', back: 'ΣF = m·a (référentiel galiléen).' },
      { front: 'Mouvement rectiligne uniformément accéléré', back: 'x(t) = ½at² + v₀t + x₀.' },
    ],
    'ph-radioactivite': [
      { front: 'Loi de décroissance radioactive', back: 'N(t) = N₀·exp(−λt).' },
      { front: 'Temps de demi-vie', back: 't₁/₂ = ln 2 / λ.' },
      { front: 'Activité A', back: 'A = λN (Becquerels).' },
    ],
    'ph-ondes-meca': [
      { front: 'Célérité d\'une onde', back: 'c = λ·f (m/s).' },
      { front: 'Célérité du son dans l\'air (20°C)', back: '340 m/s.' },
    ],
    'ph-cinetique': [
      { front: 'Temps de demi-réaction t₁/₂', back: 'C(t) = C₀/2.' },
      { front: 'Facteurs cinétiques', back: 'Concentration, température, catalyseur, lumière.' },
    ],
    'ph-mole': [
      { front: 'Quantité de matière', back: 'n = m / M (mol).' },
      { front: 'Concentration molaire', back: 'C = n / V (mol/L).' },
    ],
    'ph-chimie-org': [
      { front: 'Famille — hydroxyle', back: '−OH sur C saturé ⇒ alcool.' },
      { front: 'Famille — carbonyle', back: 'C=O (aldéhyde si en bout, cétone sinon).' },
      { front: 'Famille — carboxyle', back: '−COOH ⇒ acide carboxylique.' },
      { front: 'Liaison peptidique', back: '−CO−NH− entre deux acides aminés.' },
    ],
    'ph-reactions': [
      { front: 'Couple acide/base (Brønsted)', back: 'AH / A⁻, relation Ka = 10^(−pKa).' },
      { front: 'Couple redox', back: 'Ox / Red : l\'oxydant capte des électrons.' },
    ],
    'ph-thermo': [
      { front: 'Premier principe', back: 'ΔU = W + Q (énergie interne = travail + chaleur).' },
      { front: 'Travail isobare', back: 'W = −P·ΔV.' },
    ],
  },
  svt: {
    'sv-genetique': [
      { front: 'Mutation ponctuelle', back: 'Changement d\'un seul nucléotide (substitution).' },
      { front: 'Brassage génétique', back: 'Recombinaison méiotique + crossing-over ⇒ diversité.' },
    ],
    'sv-immuno': [
      { front: 'Lymphocyte B → ?', back: 'Plasmocyte sécréteur d\'anticorps.' },
      { front: 'CMH', back: 'Complexe Majeur d\'Histocompatibilité, présentation antigénique.' },
      { front: 'Sérothérapie vs vaccination', back: 'Séro = anticorps prêts ; Vaccin = induit la mémoire.' },
    ],
    'sv-glycemie': [
      { front: 'Insuline', back: 'Hormone hypoglycémiante (β-pancréas).' },
      { front: 'Glucagon', back: 'Hormone hyperglycémiante (α-pancréas).' },
    ],
    'sv-diversification': [
      { front: 'Synapomorphie', back: 'Caractère dérivé partagé, signe d\'ancêtre commun.' },
      { front: 'Clade', back: 'Groupe monophylétique : ancêtre + tous ses descendants.' },
    ],
    'sv-physio': [
      { front: 'Potentiel d\'action', back: 'Inversion transitoire du potentiel de membrane.' },
      { front: 'Neurotransmetteur jonction neuromusculaire', back: 'Acétylcholine.' },
    ],
  },
  philo: {
    'ph-conscience': [
      { front: 'Cogito (Descartes)', back: '« Je pense, donc je suis » — vérité indubitable.' },
      { front: 'Mauvaise foi (Sartre)', back: 'Mensonge à soi-même pour fuir sa liberté.' },
    ],
    'ph-liberte': [
      { front: 'Liberté selon Sartre', back: '« L\'homme est condamné à être libre. »' },
      { front: 'Liberté selon Spinoza', back: '« La liberté = la nécessité comprise. »' },
      { front: 'Autonomie (Kant)', back: 'S\'imposer sa propre loi (législation morale).' },
    ],
    'ph-bonheur': [
      { front: 'Eudémonisme (Aristote)', back: 'Le bonheur = activité de l\'âme selon la vertu.' },
      { front: 'Bonheur selon Pascal', back: '« Le bonheur n\'est ni dans la bassesse ni dans le divertissement. »' },
    ],
    'ph-verite': [
      { front: 'Vérité-correspondance (Aristote)', back: 'Adequatio rei et intellectus.' },
      { front: 'Critique nietzschéenne de la vérité', back: 'Métaphore devenue dogme, illusion utile.' },
    ],
    'ph-science': [
      { front: 'Falsifiabilité (Popper)', back: 'Critère de scientificité = possibilité d\'être réfuté.' },
      { front: 'Rupture épistémologique (Bachelard)', back: 'L\'obstacle scientifique demande une refonte des concepts.' },
    ],
    'ph-devoir': [
      { front: 'Impératif catégorique (Kant)', back: '« Agis uniquement selon la maxime universalisable. »' },
    ],
    'ph-justice': [
      { front: 'Voile d\'ignorance (Rawls)', back: 'Choisir les principes sans connaître sa place sociale.' },
      { front: 'Justice distributive (Aristote)', back: 'Chacun selon son mérite.' },
    ],
    'ph-etat': [
      { front: 'Monopole de la violence légitime (Weber)', back: 'Critère wébérien de l\'État.' },
    ],
    'ph-temps': [
      { front: 'Distension de l\'âme (Augustin)', back: 'Le temps est une mesure intérieure, pas objective.' },
    ],
    'ph-religion': [
      { front: 'Pari de Pascal', back: '« Si tu gagnes, tu gagnes tout ; si tu perds, tu ne perds rien. »' },
    ],
    'ph-travail': [
      { front: 'Aliénation (Marx)', back: 'Le travailleur devient étranger au produit de son travail.' },
    ],
    'ph-art': [
      { front: 'Mimesis (Platon)', back: 'L\'art imite les apparences, deux fois éloigné du vrai.' },
      { front: 'Catharsis (Aristote)', back: 'Purgation des passions par le spectacle tragique.' },
    ],
    'ph-nature': [
      { front: 'Deus sive Natura (Spinoza)', back: 'Dieu n\'est pas distinct de la nature.' },
    ],
    'ph-langage': [
      { front: 'Wittgenstein', back: '« Les limites de mon langage = les limites de mon monde. »' },
    ],
    'ph-inconscient': [
      { front: 'Refoulement (Freud)', back: 'Mécanisme central : rejet dans l\'inconscient d\'un représentant de la pulsion.' },
    ],
  },
  francais: {
    'fr-poesie': [
      { front: 'Sonnet', back: '14 vers : 2 quatrains + 2 tercets.' },
      { front: 'Métaphore', back: 'Comparaison implicite sans outil comparatif.' },
      { front: 'Enjambement', back: 'Rejet du vers sur le vers suivant (rupture syntaxique).' },
    ],
    'fr-roman': [
      { front: 'Narrateur omniscient', back: 'Voix qui connaît tout (pensées, lieux, passé).' },
      { front: 'Point de vue interne', back: 'Le narrateur = personnage focal.' },
      { front: 'Roman d\'apprentissage', back: 'Roman de la formation d\'un héros (Bildungsroman).' },
    ],
    'fr-theatre': [
      { front: 'Didascalies', back: 'Indications scéniques (jeu, décor, ton).' },
      { front: 'Stichomythie', back: 'Dialogue rapide en répliques très courtes.' },
      { front: 'Aparté', back: 'Réplique adressée au public, non entendue des autres personnages.' },
    ],
    'fr-idees': [
      { front: 'Apologue', back: 'Petit récit à visée morale (La Fontaine).' },
    ],
    'fr-methode-ecrit': [
      { front: 'Plan dialectique', back: 'Thèse / Antithèse / Synthèse.' },
      { front: 'Problématique', back: 'Question ouverte articulant le sujet et le mouvement du plan.' },
    ],
  },
  histoire: {
    'hi-guerre-froide': [
      { front: 'Doctrine Brejnev (1968)', back: 'Tout État socialiste reste sous contrôle soviétique.' },
      { front: 'Chute du mur de Berlin', back: '9 novembre 1989.' },
    ],
    'hi-decolonisation': [
      { front: 'Conférence de Bandung (1955)', back: 'Tiers-monde et non-alignement affirmés.' },
      { front: 'Accords d\'Évian', back: '18 mars 1962, fin de la guerre d\'Algérie.' },
    ],
    'geo-france': [
      { front: 'Métropolisation', back: 'Concentration des populations, emplois, fonctions dans les grandes agglomérations.' },
      { front: 'Périurbanisation', back: 'Étalement urbain dans les couronnes autour des villes.' },
    ],
    'geo-monde': [
      { front: 'IDH', back: 'Indicateur de Développement Humain (santé + éducation + niveau de vie).' },
      { front: 'PIB', back: 'Richesse produite sur un territoire pendant un an.' },
    ],
    'geo-environnement': [
      { front: 'COP21 / Accord de Paris', back: 'Limiter le réchauffement bien en-dessous de 2°C, viser 1.5°C.' },
    ],
  },
  ses: {
    'ses-croissance': [
      { front: 'PIB', back: 'Richesse produite pendant un an sur un territoire.' },
      { front: 'Croissance endogène', back: 'Innovation, capital humain, institutions ⇒ croissance.' },
    ],
    'ses-chomage': [
      { front: 'Définition BIT du chômage', back: 'Sans emploi, disponible, en recherche active (15-64 ans).' },
    ],
    'ses-inegalites': [
      { front: 'Indice de Gini', back: '0 = égalité parfaite, 1 = inégalité totale.' },
    ],
    'ses-sociologie': [
      { front: 'Habitus (Bourdieu)', back: 'Système de dispositions acquises socialement.' },
      { front: 'Capital culturel (Bourdieu)', back: 'Savoirs, savoir-faire, savoir-être.' },
    ],
    'ses-stratification': [
      { front: 'PCS', back: 'Professions et Catégories Socioprofessionnelles (INSEE).' },
    ],
    'ses-mondialisation': [
      { front: 'IDE', back: 'Investissements Directs Étrangers (prise de contrôle >10%).' },
    ],
    'ses-action-publique': [
      { front: 'Externalité', back: 'Effet sur un tiers non impliqué dans la décision.' },
    ],
    'ses-eco-politique': [
      { front: 'BCE', back: 'Politique monétaire : taux directeur, inflation.' },
      { front: 'Politique budgétaire', back: 'Dépenses publiques et impôts.' },
    ],
  },
  nsi: {
    'ns-structures': [
      { front: 'Complexité liste', back: 'Accès O(1), recherche O(n), insertion O(n).' },
      { front: 'Pile (LIFO)', back: 'push/pop en tête. push: O(1), pop: O(1).' },
      { front: 'File (FIFO)', back: 'enqueue à la fin, dequeue en tête. O(1).' },
    ],
    'ns-recursivite': [
      { front: 'Cas de base', back: 'Condition d\'arrêt de la récursion.' },
      { front: 'Cas récursif', back: 'Appel de la fonction sur une entrée plus petite.' },
    ],
    'ns-tris': [
      { front: 'Tri par insertion (pire)', back: 'O(n²).' },
      { front: 'Tri fusion', back: 'O(n log n) en moyenne et pire cas.' },
      { front: 'Tri rapide (quicksort)', back: 'O(n log n) moyen, O(n²) pire cas.' },
    ],
    'ns-graphes': [
      { front: 'BFS', back: 'Parcours en largeur (file FIFO).' },
      { front: 'DFS', back: 'Parcours en profondeur (pile / récursion).' },
      { front: 'Dijkstra', back: 'Plus court chemin à partir d\'un sommet (poids positifs).' },
    ],
    'ns-sql': [
      { front: 'SELECT', back: 'Projection : SELECT col1, col2 FROM table WHERE cond.' },
      { front: 'JOIN', back: 'Jointure entre 2 tables sur une clé commune.' },
      { front: 'Clé primaire vs étrangère', back: 'Primaire : identifie une ligne. Étrangère : référence une autre PK.' },
    ],
    'ns-reseaux': [
      { front: 'Modèle TCP/IP', back: '4 couches : application, transport, internet, accès réseau.' },
      { front: 'HTTP', back: 'Protocole web, port 80 ; HTTPS = 443.' },
      { front: 'DNS', back: 'Résolution nom → IP (port 53).' },
    ],
    'ns-secu': [
      { front: 'Chiffrement symétrique', back: 'Même clé pour chiffrer / déchiffrer (ex. AES).' },
      { front: 'Chiffrement asymétrique', back: 'Paire clé publique + privée (ex. RSA).' },
      { front: 'SHA-256', back: 'Fonction de hachage produisant un condensé de 256 bits.' },
    ],
    'ns-binaire': [
      { front: 'Conversion décimal → binaire', back: 'Divisions euclidiennes successives par 2.' },
      { front: 'Complément à 2', back: 'Représentation des entiers signés : inverser les bits + 1.' },
    ],
    'ns-arbres': [
      { front: 'ABR', back: 'Arbre binaire de recherche (gauche < nœud < droite).' },
    ],
    'ns-bool': [
      { front: 'XOR', back: '1 si les bits diffèrent, 0 sinon.' },
      { front: 'Loi de De Morgan', back: '¬(A ∧ B) ≡ ¬A ∨ ¬B.' },
    ],
  },
}

export function seedCardsFor(trackId: TrackId, chapterId: string): SeedCard[] {
  return SEED_FLASHCARDS[trackId]?.[chapterId] ?? []
}