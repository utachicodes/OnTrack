/**
 * Programme officiel du Baccalauréat général français.
 * Source : Bulletin Officiel n°8 du 25 juillet 2019 (mis à jour BO 2024).
 * Référencé par : education.gouv.fr / eduscol.education.fr
 *
 * Conformément au Bulletin Officiel 2024, applicable aux élèves passant
 * le Bac 2026 (Terminale en 2025-2026).
 */

export type TrackId =
  | 'maths'
  | 'physique'
  | 'svt'
  | 'nsi'
  | 'philo'
  | 'francais'
  | 'histoire'
  | 'ses'

export interface Chapter {
  id: string
  title: string
  objectives: string[]
  keyConcepts: string[]
  estimatedMinutes: number
}

export interface TrackProgram {
  id: TrackId
  title: string
  coefficient: number
  examDuration: string
  examFormat: string
  color: string
  tagline: string
  chapters: Chapter[]
}

/* ============================================================
   MATHÉMATIQUES (spécialité) — coef 16 — épreuve 4h
   15 chapitres selon BO 2024
   ============================================================ */
export const MATHS: TrackProgram = {
  id: 'maths',
  title: 'Mathématiques (spécialité)',
  coefficient: 16,
  examDuration: '4h',
  examFormat: '5 à 6 exercices, dont un avec Python',
  color: '#ee705f',
  tagline: 'Algèbre, analyse, probabilités, géométrie.',
  chapters: [
    {
      id: 'ma-suites',
      title: 'Suites numériques',
      estimatedMinutes: 90,
      objectives: [
        "Modéliser une situation par une suite (arithmétique, géométrique, récurrente).",
        "Déterminer le sens de variation, calculer la limite, conjecturer avec Python.",
        "Utiliser le théorème des suites monotones bornées.",
      ],
      keyConcepts: ['Récurrence u_{n+1} = f(u_n)', 'Limite finie ou infinie', 'Convergence / divergence', 'Somme géométrique Σ q^k'],
    },
    {
      id: 'ma-limites',
      title: 'Limites de fonctions',
      estimatedMinutes: 70,
      objectives: [
        "Calculer la limite en un point ou à l'infini.",
        "Lever les formes indéterminées (factorisation, taux d'accroissement, L'Hôpital).",
        "Déterminer l'asymptote horizontale, verticale, oblique.",
      ],
      keyConcepts: ['Limite à gauche / droite', 'Asymptote', 'Croissance comparée', 'Théorème du point fixe'],
    },
    {
      id: 'ma-continuite',
      title: 'Continuité',
      estimatedMinutes: 40,
      objectives: [
        "Exploiter la continuité (image d'un intervalle fermé borné).",
        "Appliquer le théorème des valeurs intermédiaires pour localiser une racine.",
      ],
      keyConcepts: ['TVI', 'Image d\'un intervalle', 'Algorithme de dichotomie'],
    },
    {
      id: 'ma-derivation',
      title: 'Dérivation',
      estimatedMinutes: 80,
      objectives: [
        "Dériver les fonctions usuelles, composées, inverse, produit, quotient.",
        "Étudier les variations, les extremums.",
        "Étudier la convexité (signe de f'').",
      ],
      keyConcepts: ['Dérivée de u∘v', 'Dérivée de 1/u', 'Signe de f et sens de variation', 'Tangente'],
    },
    {
      id: 'ma-exponentielle',
      title: 'Fonction exponentielle',
      estimatedMinutes: 50,
      objectives: [
        "Manipuler les propriétés algébriques de exp(a+b) = exp(a)·exp(b).",
        "Résoudre exp(x) = k, équations différentielles y'=ay.",
      ],
      keyConcepts: ['exp(0)=1', 'exp strictement positive', 'Dérivée = elle-même', 'Croissance rapide'],
    },
    {
      id: 'ma-logarithme',
      title: 'Fonction logarithme népérien',
      estimatedMinutes: 50,
      objectives: [
        "Résoudre ln(x·y) = ln(x)+ln(y) et ln(1/x) = -ln(x).",
        "Étudier ln (variations, dérivée 1/x, limites).",
        "Résoudre ln(x) = k.",
      ],
      keyConcepts: ['ln(1) = 0', 'ln(e) = 1', 'Dérivée 1/x', 'Croissance lente'],
    },
    {
      id: 'ma-integrale',
      title: 'Intégrales et primitives',
      estimatedMinutes: 90,
      objectives: [
        "Calculer l'intégrale d'une fonction continue positive comme aire.",
        "Trouver une primitive (par décomposition, IPP, identification).",
        "Appliquer le théorème fondamental : F(b)-F(a) = ∫ f.",
      ],
      keyConcepts: ['∫ f = F(b)-F(a)', 'Primitive et dérivée', 'IPP', 'Valeur moyenne'],
    },
    {
      id: 'ma-equations-differentielles',
      title: 'Équations différentielles',
      estimatedMinutes: 40,
      objectives: [
        "Résoudre y' = ay (solutions y = C·e^(ax)).",
        "Résoudre y' = ay + b.",
      ],
      keyConcepts: ['Solution générale + particulière', 'Condition initiale', 'Modèle Malthus / Newton'],
    },
    {
      id: 'ma-probabilites-cond',
      title: 'Probabilités conditionnelles',
      estimatedMinutes: 60,
      objectives: [
        "Construire un arbre pondéré.",
        "Calculer P(A∩B), P_A(B), P(A∪B).",
        "Appliquer Bayes.",
      ],
      keyConcepts: ['Indépendance', 'Arbre', 'Formule des probabilités totales', 'Bayes'],
    },
    {
      id: 'ma-lois',
      title: 'Lois de probabilité',
      estimatedMinutes: 70,
      objectives: [
        "Reconnaître une loi binomiale B(n,p) et l'utiliser.",
        "Utiliser les propriétés E(X), V(X) et la formule E(aX+b).",
        "Déterminer l'intervalle de fluctuation à 95%.",
      ],
      keyConcepts: ['B(n,p)', 'Espérance', 'Variance / écart-type', 'Intervalle I = [p-1/√n, p+1/√n]'],
    },
    {
      id: 'ma-echantillonnage',
      title: 'Échantillonnage et estimation',
      estimatedMinutes: 40,
      objectives: [
        "Interpréter un intervalle de confiance au niveau 95%.",
        "Décider si une proportion observée est compatible avec une proportion théorique.",
      ],
      keyConcepts: ['IC = [f-1/√n, f+1/√n]', 'Niveau 95%', 'Décision statistique'],
    },
    {
      id: 'ma-geometrie-espace',
      title: 'Géométrie dans l\'espace',
      estimatedMinutes: 60,
      objectives: [
        "Représenter un point, un vecteur, une droite, un plan.",
        "Caractériser une droite par un point + un vecteur directeur.",
        "Calculer les coordonnées d'un projeté orthogonal.",
      ],
      keyConcepts: ['Vecteur normal à un plan', 'Équation cartésienne', 'Distance point-droite', 'Distance point-plan'],
    },
    {
      id: 'ma-produit-scalaire',
      title: 'Produit scalaire dans l\'espace',
      estimatedMinutes: 40,
      objectives: [
        "Calculer un produit scalaire via les coordonnées.",
        "Déterminer l'équation d'un plan à l'aide d'un vecteur normal.",
        "Étudier l'orthogonalité.",
      ],
      keyConcepts: ['u·v = |u||v|cos θ', 'Vecteur normal', 'Équation ax+by+cz+d=0'],
    },
    {
      id: 'ma-python',
      title: 'Algorithmique et Python',
      estimatedMinutes: 60,
      objectives: [
        "Écrire une boucle, une condition, une fonction.",
        "Simuler une loi binomiale (np.random.binomial).",
        "Calculer une moyenne, un écart-type (numpy).",
        "Tracer une courbe (matplotlib).",
      ],
      keyConcepts: ['for / while', 'list / array', 'plt.plot', 'np.mean / np.std'],
    },
    {
      id: 'ma-demonstrations',
      title: 'Démonstrations exigibles',
      estimatedMinutes: 30,
      objectives: [
        "Savoir rédiger une démonstration par récurrence.",
        "Connaître les démonstrations du programme (existence √2 irrationnel, exp dérivée de exp).",
      ],
      keyConcepts: ['Initialisation', 'Hérédité', 'Conclusion'],
    },
  ],
}

/* ============================================================
   PHYSIQUE-CHIMIE (spécialité) — coef 16 — épreuve 3h30 + ECE 1h
   16 chapitres selon BO 2024
   ============================================================ */
export const PHYSIQUE: TrackProgram = {
  id: 'physique',
  title: 'Physique-Chimie (spécialité)',
  coefficient: 16,
  examDuration: '3h30 + 1h ECE',
  examFormat: '3 exercices (mécanique / chimie / ondes-optique)',
  color: '#5fb87e',
  tagline: 'Mécanique, ondes, optique, chimie organique, thermodynamique.',
  chapters: [
    { id: 'ph-newton', title: 'Mouvement et 2ᵉ loi de Newton', estimatedMinutes: 70,
      objectives: ['Identifier forces, masse, accélération.', 'Appliquer ΣF = ma dans un référentiel galiléen.', 'Reconnaître un mouvement rectiligne uniformément accéléré.'],
      keyConcepts: ['ΣF = m·a', 'PFD', 'Référentiel galiléen', 'Vecteur accélération'] },
    { id: 'ph-champ-uniforme', title: 'Mouvements dans un champ uniforme', estimatedMinutes: 60,
      objectives: ['Étudier une chute libre, un mouvement dans E ou B.', 'Prédire la trajectoire par intégration de a.'],
      keyConcepts: ['Force de Lorentz', 'Champ de pesanteur', 'Mouvement hélicoïdal'] },
    { id: 'ph-energetique', title: 'Aspects énergétiques', estimatedMinutes: 60,
      objectives: ['Calculer Ec, Ep, Em.', 'Utiliser la conservation de l\'énergie mécanique (sans frottement).'],
      keyConcepts: ['Ec = ½mv²', 'Ep = mgh', 'Em = Ec + Ep', 'Travail d\'une force'] },
    { id: 'ph-ondes-meca', title: 'Ondes mécaniques', estimatedMinutes: 60,
      objectives: ['Reconnaître une onde longitudinale / transversale.', 'Calculer la célérité, la période, la longueur d\'onde.', 'Décrire la propagation.'],
      keyConcepts: ['c = λ·f', 'Retard τ', 'Ondes sonores', 'Échelle de Richter'] },
    { id: 'ph-lunette', title: 'Lunette astronomique et optique', estimatedMinutes: 60,
      objectives: ['Construire l\'image dans une lunette afocale.', 'Calculer le grossissement.', 'Déterminer la distance focale.'],
      keyConcepts: ['Grossissement G = f₁/f₂', 'Lentille convergente', 'Objet à l\'infini'] },
    { id: 'ph-interference', title: 'Interférences et diffraction', estimatedMinutes: 50,
      objectives: ['Reconnaître des conditions d\'interférence.', 'Calculer l\'interfrange i = λD/a.'],
      keyConcepts: ['Fentes d\'Young', 'Interfrange', 'Diffraction par une fente'] },
    { id: 'ph-radioactivite', title: 'Radioactivité et décroissance', estimatedMinutes: 60,
      objectives: ['Reconnaître α, β⁻, β⁺, γ.', 'Écrire une réaction nucléaire (conservation A et Z).', 'Utiliser la loi N(t) = N₀·e^(-λt).', 'Définir temps de demi-vie.'],
      keyConcepts: ['A = Z+N', 'Fission / fusion', 't₁/₂ = ln 2 / λ', 'Activité A = λN'] },
    { id: 'ph-mole', title: 'Quantité de matière et solutions', estimatedMinutes: 50,
      objectives: ['Calculer une concentration molaire.', 'Préparer une solution par dissolution ou dilution.'],
      keyConcepts: ['n = m/M', 'C = n/V', 'Dilution C₁V₁ = C₂V₂'] },
    { id: 'ph-chimie-org', title: 'Chimie organique : groupes caractéristiques', estimatedMinutes: 80,
      objectives: ['Reconnaître les fonctions : alcool, aldéhyde, cétone, acide carboxylique, ester, amine, amide.', 'Nommer en nomenclature IUPAC.', 'Identifier les isomères.'],
      keyConcepts: ['Groupe hydroxyle -OH', 'Groupe carbonyle C=O', 'Liaison peptidique', 'Isomères Z / E'] },
    { id: 'ph-reactions', title: 'Réactions chimiques (acide-base / redox)', estimatedMinutes: 80,
      objectives: ['Écrire l\'équation d\'une réaction acido-basique.', 'Utiliser le pKa.', 'Identifier oxydant / réducteur, écrire une demi-équation redox.'],
      keyConcepts: ['pH = -log[H₃O⁺]', 'Ka, pKa', 'Couple redox', 'Équilibrer H₂O, H⁺, e⁻'] },
    { id: 'ph-cinetique', title: 'Cinétique chimique', estimatedMinutes: 50,
      objectives: ['Tracer une courbe [A] = f(t).', 'Déterminer le temps de demi-réaction.', 'Identifier les facteurs cinétiques (T°, concentration, catalyseur).'],
      keyConcepts: ['Vitesse volumique', 't₁/₂', 'Catalyse homogène / hétérogène / enzymatique'] },
    { id: 'ph-thermo', title: 'Thermodynamique', estimatedMinutes: 50,
      objectives: ['Distinguer adiabatique / isotherme / isobare / isochore.', 'Calculer un travail W = -PΔV.'],
      keyConcepts: ['Premier principe ΔU = W + Q', 'Enthalpie H', 'Capacité thermique'] },
    { id: 'ph-acide-base', title: 'Réactions acido-basiques (approfondissement)', estimatedMinutes: 50,
      objectives: ['Reconnaître un acide / base selon Brønsted.', 'Prévoir le sens d\'une réaction à partir des pKa.'],
      keyConcepts: ['Ka = 10^(-pKa)', 'pH-métrie', 'Indicateurs colorés'] },
    { id: 'ph-eau', title: 'Eau et environnement', estimatedMinutes: 40,
      objectives: ['Comprendre les pluies acides, le traitement de l\'eau.', 'Reconnaître les paramètres physico-chimiques d\'une eau.'],
      keyConcepts: ['Dureté TH', 'pH', 'Conductivité', 'Cycle de l\'eau'] },
    { id: 'ph-numerique', title: 'Mesure et incertitudes', estimatedMinutes: 40,
      objectives: ['Évaluer une incertitude-type.', 'Présenter un résultat avec son incertitude.'],
      keyConcepts: ['u(x) = σ/√n', 'z·score', 'Incertitude relative'] },
    { id: 'ph-electro', title: 'Électrocinétique', estimatedMinutes: 50,
      objectives: ['Calculer l\'intensité, la tension, la puissance dans un circuit.', 'Connaître les lois des nœuds et des mailles.'],
      keyConcepts: ['U = R·I', 'Loi des nœuds', 'Loi des mailles', 'P = U·I'] },
  ],
}

/* ============================================================
   SVT (spécialité) — coef 16 — épreuve 3h30 + ECE 1h
   ============================================================ */
export const SVT: TrackProgram = {
  id: 'svt',
  title: 'SVT (spécialité)',
  coefficient: 16,
  examDuration: '3h30 + 1h ECE',
  examFormat: '2 parties (SVT + ECE pratique)',
  color: '#7d5fb8',
  tagline: 'Génétique, immunologie, géologie, corps humain.',
  chapters: [
    { id: 'sv-genetique', title: 'Génétique et évolution', estimatedMinutes: 70,
      objectives: ['Identifier les sources de variation (mutations, brassage).', 'Comprendre la sélection naturelle et la dérive génétique.'],
      keyConcepts: ['Mutation', 'Méiose', 'Sélection naturelle', 'Dérive génétique'] },
    { id: 'sv-diversification', title: 'Diversification du vivant', estimatedMinutes: 60,
      objectives: ['Tracer un arbre phylogénétique.', 'Identifier des caractères dérivés partagés.'],
      keyConcepts: ['Phylogénie', 'Caractère ancestral / dérivé', 'Clade'] },
    { id: 'sv-genome-humain', title: 'Histoire humaine lue dans son génome', estimatedMinutes: 50,
      objectives: ['Expliquer l\'origine africaine de l\'Homo sapiens.', 'Comprendre la diversité génétique humaine actuelle.'],
      keyConcepts: ['ADN mitochondrial', 'Migrations', 'Bottleneck'] },
    { id: 'sv-climat', title: 'Climat et atmosphère', estimatedMinutes: 50,
      objectives: ['Décrire les variations climatiques passées.', 'Comprendre l\'effet de serre additionnel.'],
      keyConcepts: ['Gaz à effet de serre', 'Cycles de Milankovitch', 'Paléoclimats'] },
    { id: 'sv-geothermie', title: 'Géothermie et géodynamique', estimatedMinutes: 50,
      objectives: ['Relier géothermie et tectonique des plaques.', 'Comprendre la convection mantellique.'],
      keyConcepts: ['Flux géothermique', 'Convection', 'Tectonique des plaques'] },
    { id: 'sv-immuno', title: 'Immunologie innée et adaptative', estimatedMinutes: 80,
      objectives: ['Décrire les barrières naturelles, la phagocytose.', 'Décrire la réponse adaptative humorale et cellulaire.'],
      keyConcepts: ['Macrophage', 'Lymphocyte B / T', 'Anticorps', 'CMH'] },
    { id: 'sv-vaccin', title: 'Vaccination et immunothérapie', estimatedMinutes: 40,
      objectives: ['Expliquer le principe de la vaccination.', 'Distinguer sérothérapie et vaccination.'],
      keyConcepts: ['Mémoire immunitaire', 'Antigène', 'Adjuvant'] },
    { id: 'sv-microbiote', title: 'Microbiote et santé', estimatedMinutes: 40,
      objectives: ['Décrire le rôle du microbiote intestinal.', 'Identifier les interactions hôte-microbe.'],
      keyConcepts: ['Symbiose', 'Flore commensale', 'Probiotiques'] },
    { id: 'sv-physio', title: 'Physiologie musculaire et nerveuse', estimatedMinutes: 60,
      objectives: ['Décrire le potentiel d\'action, la contraction musculaire.', 'Comprendre la jonction neuromusculaire.'],
      keyConcepts: ['Potentiel d\'action', 'Synapse', 'Acétylcholine', 'Calcique sarcoplasmique'] },
    { id: 'sv-reproduction', title: 'Reproduction et hormones', estimatedMinutes: 50,
      objectives: ['Expliquer la régulation hormonale (axe HPG).', 'Décrire la gamétogenèse.'],
      keyConcepts: ['FSH / LH', 'Œstrogènes / progestérone / testostérone', 'Cycle menstruel'] },
    { id: 'sv-glycemie', title: 'Glycémie et diabète', estimatedMinutes: 40,
      objectives: ['Expliquer la régulation de la glycémie.', 'Identifier les causes du diabète.'],
      keyConcepts: ['Insuline / glucagon', 'Diabète type 1 / 2', 'HbA1c'] },
    { id: 'sv-biodiversite', title: 'Biodiversité et écosystèmes', estimatedMinutes: 40,
      objectives: ['Quantifier la biodiversité (richesse, équitabilité).', 'Identifier les services écosystémiques.'],
      keyConcepts: ['Indice de Shannon', 'Services écologiques', 'Perturbations'] },
  ],
}

/* ============================================================
   PHILOSOPHIE — coef 8 — épreuve 4h (15 juin 2026)
   17 notions selon BO du 25 juillet 2019
   ============================================================ */
export const PHILO: TrackProgram = {
  id: 'philo',
  title: 'Philosophie',
  coefficient: 8,
  examDuration: '4h',
  examFormat: '3 sujets au choix (2 dissertations + 1 explication de texte)',
  color: '#d4a05a',
  tagline: '17 notions au programme officiel (BO 25 juillet 2019).',
  chapters: [
    { id: 'ph-conscience', title: 'La conscience', estimatedMinutes: 50,
      objectives: ['Distinguer conscience psychologique et conscience morale.', 'Articuler conscience et inconscient.'],
      keyConcepts: ['Cogito (Descartes)', 'Conscience morale (Kant)', 'Conscience malheureuse (Hegel)', 'Mauvaise foi (Sartre)'] },
    { id: 'ph-inconscient', title: 'L\'inconscient', estimatedMinutes: 40,
      objectives: ['Définir l\'inconscient (Freud).', 'Questionner sa légitimité scientifique.'],
      keyConcepts: ['Ça, Moi, Surmoi', 'Refoulement', 'Acte manqué', 'Inconscient structuré (Lacan)'] },
    { id: 'ph-raison', title: 'La raison', estimatedMinutes: 50,
      objectives: ['Distinguer raison théorique et raison pratique.', 'Questionner les limites de la raison (Hume, Pascal).'],
      keyConcepts: ['Raison pure / pratique (Kant)', 'Avoir le courage de se servir de son entendement', 'Esclave des passions (Hume)'] },
    { id: 'ph-verite', title: 'La vérité', estimatedMinutes: 40,
      objectives: ['Distinguer vérité-correspondance, cohérence, pragmatisme.'],
      keyConcepts: ['Adequatio rei et intellectus', 'Évidence', 'Théorie du complot', 'Pragmatisme (James)'] },
    { id: 'ph-science', title: 'La science', estimatedMinutes: 40,
      objectives: ['Distinguer science et opinion.', 'Comprendre l\'épistémologie (Bachelard, Popper).'],
      keyConcepts: ['Falsifiabilité (Popper)', 'Rupture épistémologique', 'Théorie / expérience', 'Méthode (Descartes)'] },
    { id: 'ph-nature', title: 'La nature', estimatedMinutes: 40,
      objectives: ['Distinguer nature et culture (Rousseau).', 'Questionner la maîtrise technique de la nature.'],
      keyConcepts: ['État de nature', 'Deus sive Natura (Spinoza)', 'Responsabilité (Hans Jonas)'] },
    { id: 'ph-technique', title: 'La technique', estimatedMinutes: 40,
      objectives: ['Questionner la technique comme prolongement ou aliénation de l\'homme.'],
      keyConcepts: ['Prométhée', 'Homo faber (Bergson)', 'Arraisonnement (Heidegger)', 'Technique et risque'] },
    { id: 'ph-art', title: 'L\'art', estimatedMinutes: 40,
      objectives: ['Distinguer imitation, expression, création.', 'Comprendre la fin de l\'art (Hegel).'],
      keyConcepts: ['Catharsis (Aristote)', 'Jugement esthétique (Kant)', 'Apollon / Dionysos (Nietzsche)'] },
    { id: 'ph-langage', title: 'Le langage', estimatedMinutes: 40,
      objectives: ['Questionner le rapport langage / pensée.'],
      keyConcepts: ['Animal rationnel (Aristote)', 'Langage qui trahit (Bergson)', 'Wittgenstein', 'Saussure'] },
    { id: 'ph-liberte', title: 'La liberté', estimatedMinutes: 60,
      objectives: ['Distinguer liberté formelle et liberté réelle.', 'Opposer liberté et déterminisme.'],
      keyConcepts: ['Liberté conditionnée (Spinoza)', 'Autonomie (Kant)', 'Condamné à être libre (Sartre)', 'Liberté civile (Rousseau)'] },
    { id: 'ph-devoir', title: 'Le devoir', estimatedMinutes: 40,
      objectives: ['Distinguer devoir et inclination.', 'Comprendre l\'impératif catégorique.'],
      keyConcepts: ['Impératif catégorique (Kant)', 'Agis selon la maxime universalisable', 'Devoir et utilité'] },
    { id: 'ph-justice', title: 'La justice', estimatedMinutes: 50,
      objectives: ['Distinguer justice commutative et distributive.', 'Opposer justice et droit.'],
      keyConcepts: ['Justice comme harmonie (Platon)', 'Justice distributive (Aristote)', 'Volonté générale (Rousseau)', 'Voile d\'ignorance (Rawls)'] },
    { id: 'ph-etat', title: 'L\'État', estimatedMinutes: 50,
      objectives: ['Questionner la légitimité de l\'État.', 'Comprendre totalitarisme et démocratie.'],
      keyConcepts: ['Léviathan (Hobbes)', 'État libéral (Locke)', 'Monopole de la violence (Weber)', 'Banalité du mal (Arendt)'] },
    { id: 'ph-bonheur', title: 'Le bonheur', estimatedMinutes: 50,
      objectives: ['Distinguer hédonisme, eudémonisme, utilitarisme.', 'Questionner la possibilité du bonheur.'],
      keyConcepts: ['Eudémonie (Aristote)', 'Ataraxie (Épicure)', 'Souverain bien', 'Impossible bonheur terrestre (Pascal)'] },
    { id: 'ph-travail', title: 'Le travail', estimatedMinutes: 40,
      objectives: ['Distinguer travail et oeuvre (Arendt).', 'Questionner l\'aliénation.'],
      keyConcepts: ['Travail formateur (Hegel)', 'Aliénation (Marx)', 'Condition de l\'Homo faber'] },
    { id: 'ph-temps', title: 'Le temps', estimatedMinutes: 40,
      objectives: ['Distinguer temps physique et durée.', 'Questionner l\'instant.'],
      keyConcepts: ['Distension de l\'âme (Augustin)', 'Durée (Bergson)', 'Éternel retour (Nietzsche)'] },
    { id: 'ph-religion', title: 'La religion', estimatedMinutes: 30,
      objectives: ['Questionner l\'origine et la fonction de la religion.'],
      keyConcepts: ['Pari (Pascal)', 'Opium du peuple (Marx)', 'Mort de Dieu (Nietzsche)', 'Illusion (Freud)'] },
  ],
}

/* ============================================================
   FRANÇAIS (épreuves anticipées de Première) — coef 10
   12 œuvres selon BO 25 juillet 2024
   4 objets d'étude
   ============================================================ */
export const FRANCAIS: TrackProgram = {
  id: 'francais',
  title: 'Français (épreuves anticipées)',
  coefficient: 10,
  examDuration: '4h écrit + 20 min oral',
  examFormat: 'Commentaire OU dissertation (écrit) + entretien (oral)',
  color: '#5266b6',
  tagline: '12 œuvres au programme, 4 objets d\'étude.',
  chapters: [
    { id: 'fr-poesie', title: 'La poésie — 4 œuvres', estimatedMinutes: 80,
      objectives: ['Identifier les formes fixes (sonnet, ballade) et libres.', 'Analyser les procédés poétiques (versification, figures).'],
      keyConcepts: ['Versification', 'Rimes', 'Métaphore / comparaison', 'Prose poétique'] },
    { id: 'fr-roman', title: 'Le roman — 3 œuvres', estimatedMinutes: 80,
      objectives: ['Identifier le narrateur, le point de vue.', 'Comprendre le schéma narratif et les enjeux du roman.'],
      keyConcepts: ['Narrateur', 'Point de vue', 'Schéma narratif', 'Roman d\'apprentissage'] },
    { id: 'fr-theatre', title: 'Le théâtre — 3 œuvres', estimatedMinutes: 80,
      objectives: ['Analyser le dialogue théâtral, les didascalies.', 'Comprendre la mise en scène, le jeu des acteurs.'],
      keyConcepts: ['Didascalies', 'Stichomythie', 'Aparté', 'Quête / conflit'] },
    { id: 'fr-idees', title: 'La littérature d\'idées — 2 œuvres', estimatedMinutes: 60,
      objectives: ['Identifier l\'essai, l\'apologue, le pamphlet.', 'Repérer les thèses, les arguments, les exemples.'],
      keyConcepts: ['Essai', 'Apologue', 'Argumentation', 'Critique sociale'] },
    { id: 'fr-methode-ecrit', title: 'Méthode de l\'écrit (commentaire / dissertation)', estimatedMinutes: 60,
      objectives: ['Construire un plan en 3 parties.', 'Formuler une problématique littéraire.', 'Citer et analyser.'],
      keyConcepts: ['Problématique', 'Plan dialectique / thématique', 'Citation intégrée', 'Analyse linéaire'] },
    { id: 'fr-methode-oral', title: 'Méthode de l\'oral', estimatedMinutes: 40,
      objectives: ['Présenter un projet de lecture en 10 min.', 'Soutenir un dialogue argumentatif de 10 min.'],
      keyConcepts: ['Lecture cursive', 'Entretien', 'Argumentation', 'Réponse aux questions'] },
  ],
}

/* ============================================================
   HISTOIRE-GÉOGRAPHIE — tronc commun
   ============================================================ */
export const HISTOIRE: TrackProgram = {
  id: 'histoire',
  title: 'Histoire-Géographie (tronc commun)',
  coefficient: 6,
  examDuration: 'Contrôle continu + épreuves',
  examFormat: 'Composition + étude de documents',
  color: '#5266b6',
  tagline: 'Histoire du XXᵉ siècle + géographie de la France et du monde.',
  chapters: [
    { id: 'hi-guerre-froide', title: 'La Guerre froide (1947-1991)', estimatedMinutes: 50,
      objectives: ['Décrire le bipolarisme USA / URSS.', 'Identifier les crises (Berlin, Cuba, Vietnam).'],
      keyConcepts: ['Bipolarisme', 'Rideau de fer', 'Coexistence pacifique', 'Détente'] },
    { id: 'hi-decolonisation', title: 'La décolonisation', estimatedMinutes: 50,
      objectives: ['Identifier les causes et étapes.', 'Comprendre les guerres (Indochine, Algérie).'],
      keyConcepts: ['Tiers-monde', 'Non-alignement', 'Conférence de Bandung', 'Guerre d\'Algérie'] },
    { id: 'hi-monde-bipolaire', title: 'Le monde bipolaire (1989-2001)', estimatedMinutes: 40,
      objectives: ['Comprendre la chute du mur de Berlin.', 'Analyser la mondialisation.'],
      keyConcepts: ['Chute du mur', 'Hyperpuissance', '11 septembre', 'Mondialisation'] },
    { id: 'geo-france', title: 'La France : dynamiques territoriales', estimatedMinutes: 50,
      objectives: ['Identifier les dynamiques de population, d\'urbanisation, d\'emploi.'],
      keyConcepts: ['Métropolisation', 'Périurbanisation', 'Désertification rurale', 'Migrations'] },
    { id: 'geo-monde', title: 'Le monde : espaces et flux', estimatedMinutes: 50,
      objectives: ['Analyser les flux migratoires, économiques, informationnels.'],
      keyConcepts: ['Migrations', 'Mondialisation', 'Fracture numérique', 'Ressources'] },
    { id: 'geo-environnement', title: 'Environnement et développement durable', estimatedMinutes: 40,
      objectives: ['Comprendre les enjeux climatiques, la COP.'],
      keyConcepts: ['GES', 'Réchauffement', 'Développement durable', 'Traités internationaux'] },
  ],
}

/* ============================================================
   SES (sciences économiques et sociales) — coef 16
   ============================================================ */
export const SES: TrackProgram = {
  id: 'ses',
  title: 'Sciences Économiques et Sociales (spécialité)',
  coefficient: 16,
  examDuration: '4h',
  examFormat: 'Dissertation OU épreuve composée (EC1+EC2+EC3)',
  color: '#ee705f',
  tagline: 'Économie, sociologie, sciences politiques.',
  chapters: [
    { id: 'ses-croissance', title: 'Croissance économique', estimatedMinutes: 40,
      objectives: ['Mesurer la croissance (PIB, IDH).', 'Identifier les sources (capital, travail, productivité).'],
      keyConcepts: ['PIB', 'IDH', 'Productivité', 'Capital'] },
    { id: 'ses-sources', title: 'Sources et défis de la croissance', estimatedMinutes: 50,
      objectives: ['Comprendre la croissance endogène (savoir, innovation).'],
      keyConcepts: ['Croissance endogène', 'Innovation', 'Capital humain', 'Institutions'] },
    { id: 'ses-chomage', title: 'Chômage', estimatedMinutes: 40,
      objectives: ['Mesurer et expliquer le chômage.'],
      keyConcepts: ['BIT', 'Taux de chômage', 'Sous-emploi', 'Flexibilité'] },
    { id: 'ses-inegalites', title: 'Inégalités économiques et sociales', estimatedMinutes: 40,
      objectives: ['Distinguer inégalités, discriminations.'],
      keyConcepts: ['Courbe de Lorenz', 'Indice de Gini', 'Mobilité sociale', 'Capital social'] },
    { id: 'ses-mobilite', title: 'Mobilité sociale', estimatedMinutes: 40,
      objectives: ['Mesurer la mobilité (absolue / relative).'],
      keyConcepts: ['Mobilité intergénérationnelle', 'Capital culturel (Bourdieu)', 'Effondrement'] },
    { id: 'ses-mondialisation', title: 'Mondialisation économique', estimatedMinutes: 50,
      objectives: ['Identifier les flux (biens, capitaux, personnes).'],
      keyConcepts: ['IDE', 'Firmes transnationales', 'Libre-échange', 'Protectionnisme'] },
    { id: 'ses-eco-politique', title: 'Économie et politique', estimatedMinutes: 40,
      objectives: ['Comprendre la régulation par l\'État.'],
      keyConcepts: ['Politique budgétaire', 'Politique monétaire', 'BCE', 'Dette publique'] },
    { id: 'ses-sociologie', title: 'Sociologie : socialisation et individu', estimatedMinutes: 40,
      objectives: ['Décrire les instances de socialisation.'],
      keyConcepts: ['Socialisation primaire / secondaire', 'Habitus (Bourdieu)', 'Identité'] },
    { id: 'ses-stratification', title: 'Stratification sociale', estimatedMinutes: 40,
      objectives: ['Décrire les PCS et la mobilité sociale.'],
      keyConcepts: ['PCS', 'Classes sociales', 'Reproduction sociale'] },
    { id: 'ses-politique', title: 'Sciences politiques : vote et opinion', estimatedMinutes: 40,
      objectives: ['Analyser les comportements électoraux.'],
      keyConcepts: ['Vote', 'Abstention', 'Sondage', 'Biais'] },
    { id: 'ses-action-publique', title: 'Action publique et régulation', estimatedMinutes: 40,
      objectives: ['Comprendre l\'action publique (objectifs, instruments).'],
      keyConcepts: ['Biens communs', 'Externalités', 'Politiques publiques'] },
    { id: 'ses-institutions', title: 'Institutions européennes et internationales', estimatedMinutes: 40,
      objectives: ['Comprendre l\'UE, le FMI, l\'OMC.'],
      keyConcepts: ['UE', 'Euro', 'OMC', 'FMI'] },
  ],
}

/* ============================================================
   NSI (Numérique et Sciences Informatiques) — coef 16
   ============================================================ */
export const NSI: TrackProgram = {
  id: 'nsi',
  title: 'NSI (Numérique et Sciences Informatiques)',
  coefficient: 16,
  examDuration: '3h30 + 1h pratique',
  examFormat: 'Écrit + pratique (Python, SQL, web)',
  color: '#5fb87e',
  tagline: 'Algorithmique, Python, SQL, réseaux, sécurité.',
  chapters: [
    { id: 'ns-structures', title: 'Structures de données', estimatedMinutes: 80,
      objectives: ['Manipuler listes, piles, files, dictionnaires.', 'Comprendre la complexité.'],
      keyConcepts: ['Listes', 'Piles', 'Files', 'Dictionnaires', 'Complexité O(n)'] },
    { id: 'ns-recursivite', title: 'Récursivité', estimatedMinutes: 50,
      objectives: ['Écrire une fonction récursive.', 'Identifier le cas de base et le cas récursif.'],
      keyConcepts: ['Cas de base', 'Appel récursif', 'Pile d\'appels', 'Mémoïsation'] },
    { id: 'ns-dpr', title: 'Diviser pour régner', estimatedMinutes: 50,
      objectives: ['Implémenter la recherche dichotomique, le tri fusion.'],
      keyConcepts: ['Dichotomie', 'Tri fusion', 'Complexité O(log n)', 'O(n log n)'] },
    { id: 'ns-dynamique', title: 'Programmation dynamique', estimatedMinutes: 50,
      objectives: ['Mémoïser pour éviter les calculs redondants.'],
      keyConcepts: ['Mémoïsation', 'Sous-problèmes', 'Fibonacci rapide'] },
    { id: 'ns-tris', title: 'Algorithmes de tri', estimatedMinutes: 50,
      objectives: ['Comparer tri par insertion, sélection, fusion, rapide.'],
      keyConcepts: ['Tri par insertion', 'Tri rapide', 'Complexité asymptotique'] },
    { id: 'ns-graphes', title: 'Graphes', estimatedMinutes: 60,
      objectives: ['Représenter un graphe (matrice d\'adjacence, dictionnaire).', 'Parcourir en largeur / profondeur.'],
      keyConcepts: ['BFS', 'DFS', 'A*', 'Dijkstra'] },
    { id: 'ns-arbres', title: 'Arbres binaires', estimatedMinutes: 50,
      objectives: ['Parcourir un ABR (infixe, préfixe, suffixe).'],
      keyConcepts: ['ABR', 'Hauteur', 'Équilibrage', 'Rotation'] },
    { id: 'ns-sql', title: 'Bases de données relationnelles', estimatedMinutes: 80,
      objectives: ['Modéliser en tables, écrire des requêtes SQL.', 'Comprendre les jointures, les contraintes.'],
      keyConcepts: ['SELECT / WHERE / JOIN', 'Clé primaire / étrangère', 'Schéma relationnel'] },
    { id: 'ns-archi', title: 'Architecture matérielle', estimatedMinutes: 50,
      objectives: ['Comprendre processeur, mémoire, bus.'],
      keyConcepts: ['CPU', 'RAM', 'Cache', 'Pipeline'] },
    { id: 'ns-os', title: 'Systèmes d\'exploitation', estimatedMinutes: 40,
      objectives: ['Comprendre processus, threads, gestion de mémoire.'],
      keyConcepts: ['Processus', 'Thread', 'Mémoire virtuelle', 'Système de fichiers'] },
    { id: 'ns-reseaux', title: 'Réseaux', estimatedMinutes: 60,
      objectives: ['Comprendre le modèle TCP/IP, HTTP, DNS.'],
      keyConcepts: ['TCP / UDP', 'IP', 'HTTP', 'DNS', 'Routage'] },
    { id: 'ns-web', title: 'Web : HTML, CSS, JavaScript', estimatedMinutes: 60,
      objectives: ['Créer une page web statique et dynamique.'],
      keyConcepts: ['HTML / CSS', 'DOM', 'Fetch API', 'REST'] },
    { id: 'ns-secu', title: 'Sécurité', estimatedMinutes: 50,
      objectives: ['Comprendre chiffrement, signature, hash.'],
      keyConcepts: ['Symétrique / asymétrique', 'RSA', 'SHA-256', 'HTTPS'] },
    { id: 'ns-photo', title: 'Photos et images', estimatedMinutes: 30,
      objectives: ['Comprendre la représentation binaire d\'une image.'],
      keyConcepts: ['Pixels', 'RGB', 'Compression'] },
    { id: 'ns-binaire', title: 'Représentation des nombres', estimatedMinutes: 40,
      objectives: ['Convertir entre binaire, hexadécimal, décimal.', 'Comprendre le complément à 2.'],
      keyConcepts: ['Binaire', 'Hexadécimal', 'Complément à 2'] },
    { id: 'ns-bool', title: 'Algèbre de Boole', estimatedMinutes: 30,
      objectives: ['Construire des circuits logiques.'],
      keyConcepts: ['ET / OU / NON', 'Table de vérité', 'Karnaugh'] },
    { id: 'ns-langages', title: 'Histoire et paradigmes des langages', estimatedMinutes: 30,
      objectives: ['Distinguer impératif, fonctionnel, objet.'],
      keyConcepts: ['Impératif', 'Fonctionnel', 'Objet', 'Script'] },
    { id: 'ns-projet', title: 'Projet et bonnes pratiques', estimatedMinutes: 40,
      objectives: ['Versionner (Git), tester, documenter.'],
      keyConcepts: ['Git', 'Tests unitaires', 'Doc', 'CI/CD'] },
  ],
}

/* ============================================================
   Catalogue des pistes
   ============================================================ */
export const BAC_TRACKS: TrackProgram[] = [MATHS, PHYSIQUE, SVT, PHILO, FRANCAIS, HISTOIRE, SES, NSI]

export function trackById(id: TrackId): TrackProgram | undefined {
  return BAC_TRACKS.find((t) => t.id === id)
}

export function chapterById(trackId: TrackId, chapterId: string) {
  return trackById(trackId)?.chapters.find((c) => c.id === chapterId)
}