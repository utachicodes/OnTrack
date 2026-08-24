export type WidgetSpec =
  | { type: 'python'; task: string; starter: string; expected: string; hint: string }
  | { type: 'projectile' }
  | { type: 'pendule' }
  | { type: 'orbites' }
  | { type: 'grapheur' }
  | { type: 'cercle-trigo' }
  | { type: 'tangente' }

export type QuizQuestion = { q: string; options: string[]; answer: number }

export type Lesson = {
  id: string
  title: string
  minutes: number
  intro: string[]
  keyPoints: string[]
  widget?: WidgetSpec
  quiz: QuizQuestion[]
}

export type TrackId = 'code' | 'python' | 'physique' | 'maths'

export type Track = {
  id: TrackId
  title: string
  tagline: string
  color: string
  lessons: Lesson[]
}

export const TRACKS: Track[] = [
  {
    id: 'code',
    title: 'Code : premiers pas',
    tagline: 'Apprends à penser comme une machine, depuis zéro.',
    color: '#ee705f',
    lessons: [
      {
        id: 'code-hello',
        title: "Qu'est-ce qu'un programme ?",
        minutes: 6,
        intro: [
          'Un programme est une suite d’instructions exécutées par la machine, dans l’ordre, sans en sauter ni inventer aucune. C’est une recette de cuisine : les ingrédients sont les données, les étapes sont les instructions.',
          "L'ordinateur fait exactement ce que tu écris, pas ce que tu veux dire. Cette précision forcée est un super-pouvoir : elle t'apprend à structurer ta pensée.",
          'À droite, un vrai Python tourne dans ton navigateur. Exécute le code, modifie-le, réexécute : rien ne peut casser.',
        ],
        keyPoints: [
          'Un programme s’exécute ligne par ligne, de haut en bas.',
          'print(...) affiche du texte à l’écran.',
          'Le texte (chaîne de caractères) se met entre guillemets.',
          'Une erreur n’est pas un échec : c’est la machine qui te dit ce qu’elle n’a pas compris.',
        ],
        widget: {
          type: 'python',
          task: 'Fais afficher exactement « Bonjour le BAC » par le programme.',
          starter: '# Écris ton premier instruction ci-dessous\nprint("Bonjour")\n',
          expected: 'Bonjour le BAC',
          hint: 'Remplace le texte entre guillemets par : Bonjour le BAC',
        },
        quiz: [
          { q: 'Dans quel ordre sont exécutées les instructions ?', options: ['Du bas vers le haut', 'De haut en bas', 'Au hasard'], answer: 1 },
          { q: 'À quoi sert print(...) ?', options: ['À imprimer sur papier', 'À afficher un résultat', 'À effacer le code'], answer: 1 },
          { q: 'Comment écrit-on du texte en Python ?', options: ['Entre guillemets', 'Sans rien', 'Entre parenthèses'], answer: 0 },
        ],
      },
      {
        id: 'code-variables',
        title: 'Variables et types',
        minutes: 8,
        intro: [
          'Une variable est une boîte étiquetée qui garde une valeur en mémoire : age = 17 crée la boîte « age » contenant 17. On peut la lire, la modifier, la combiner avec d’autres.',
          'Les types importants pour commencer : int (entier), float (décimal), str (texte), bool (vrai/faux). Le type décide de ce qu’on peut faire : 7 + 3 vaut 10, mais "7" + "3" vaut "73" : on colle du texte.',
          'Les opérateurs de base : + − * / et // (division entière), % (reste), ** (puissance).',
        ],
        keyPoints: [
          'a = 7 affecte la valeur 7 à la variable a.',
          'int pour les entiers, float pour les décimaux, str pour le texte.',
          '% donne le reste d’une division : 17 % 5 vaut 2.',
          '** est la puissance : 2**10 vaut 1024.',
        ],
        widget: {
          type: 'python',
          task: 'Crée a = 7 et b = 3, puis fais afficher leur somme et leur produit sur une même ligne : « 10 21 ».',
          starter: 'a = 7\nb = 3\n# affiche la somme puis le produit séparés par un espace\n',
          expected: '10 21',
          hint: 'print(a + b, a * b) affiche les deux résultats séparés par un espace.',
        },
        quiz: [
          { q: 'Que vaut 17 % 5 ?', options: ['3', '2', '3.4'], answer: 1 },
          { q: 'Que vaut "7" + "3" ?', options: ['10', '"73"', 'Erreur'], answer: 1 },
          { q: 'Quel type pour la valeur 3.14 ?', options: ['int', 'str', 'float'], answer: 2 },
        ],
      },
      {
        id: 'code-conditions',
        title: 'Conditions : if / elif / else',
        minutes: 8,
        intro: [
          'Une condition permet au programme de choisir. Si la condition est vraie, le bloc indenté s’exécute ; sinon, c’est le bloc else. L’indentation (les 4 espaces) délimite les blocs : en Python, elle fait partie du langage.',
          'Les comparaisons : == (égal), != (différent), < , > , <= , >=. Et on combine avec and, or, not.',
          'C’est ainsi qu’un logiciel « prend des décisions » : une mention de Bac, une alerte de temps restant, une validation de formulaire… tout repose sur des conditions.',
        ],
        keyPoints: [
          'if note >= 10 : exécute le bloc indenté si c’est vrai.',
          'elif enchaîne une deuxième condition, else attrape tous les autres cas.',
          '== compare, = affecte : ne pas confondre !',
          'L’indentation (4 espaces) définit les blocs.',
        ],
        widget: {
          type: 'python',
          task: 'Avec note = 14, écris une condition qui affiche « Admis » si la note est supérieure ou égale à 10, sinon « Ajourné ». Ici le programme doit afficher « Admis ».',
          starter: 'note = 14\n# écris la condition ci-dessous\n',
          expected: 'Admis',
          hint: 'if note >= 10:\n    print("Admis")\nelse:\n    print("Ajourné")',
        },
        quiz: [
          { q: 'Quel opérateur teste l’égalité ?', options: ['=', '==', '==='], answer: 1 },
          { q: 'Que fait le bloc else ?', options: ['Tourne toujours', 'Tourne si la condition if est fausse', 'Arrête le programme'], answer: 1 },
          { q: 'À quoi sert l’indentation en Python ?', options: ['À décorer', 'À définir les blocs', 'Rien'], answer: 1 },
        ],
      },
      {
        id: 'code-boucles',
        title: 'Boucles : for et while',
        minutes: 8,
        intro: [
          'Une boucle répète des instructions. for i in range(1, 6) répète pour i valant 1, 2, 3, 4, 5 (la borne de fin est exclue, piège classique. while tourne tant qu’une condition reste vraie : attention aux boucles infinies !',
          'La force des boucles : traiter mille notes, dessiner mille points, tester mille valeurs… en trois lignes de code.',
        ],
        keyPoints: [
          'range(1, 6) produit 1, 2, 3, 4, 5 (le 6 est exclu).',
          'for = nombre de tours connu, while = condition d’arrêt.',
          'break sort immédiatement d’une boucle.',
          'Une boucle infinie gèle le programme : vérifie toujours que la condition peut devenir fausse.',
        ],
        widget: {
          type: 'python',
          task: 'Fais afficher les nombres de 1 à 5, un par ligne, avec une boucle for.',
          starter: '# utilise range et une boucle for\n',
          expected: '1\n2\n3\n4\n5',
          hint: 'for i in range(1, 6):\n    print(i)',
        },
        quiz: [
          { q: 'Que produit range(1, 4) ?', options: ['1, 2, 3, 4', '1, 2, 3', '0, 1, 2, 3'], answer: 1 },
          { q: 'Quelle boucle quand on ne sait pas combien de tours ?', options: ['for', 'while', 'print'], answer: 1 },
          { q: 'Comment sortir d’une boucle dès que besoin ?', options: ['stop', 'exit', 'break'], answer: 2 },
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python : niveau suivant',
    tagline: 'Fonctions, listes, textes : les vrais outils du développeur.',
    color: '#5266b6',
    lessons: [
      {
        id: 'py-fonctions',
        title: 'Écrire des fonctions',
        minutes: 9,
        intro: [
          'Une fonction emballe un calcul réutilisable sous un nom : def aire(largeur, hauteur): return largeur * hauteur. On écrit une fois, on appelle cent fois. C’est la base de tout code propre.',
          'return renvoie un résultat utilisable ailleurs ; print se contente d’afficher. Une fonction bien nommée documente le programme mieux qu’un commentaire.',
        ],
        keyPoints: [
          'def nom(paramètres): définit la fonction.',
          'return renvoie la valeur à l’appelant.',
          'Les paramètres sont des variables locales à la fonction.',
          'aire(5, 4) appelle la fonction avec 5 et 4.',
        ],
        widget: {
          type: 'python',
          task: 'Écris une fonction aire(l, L) qui renvoie l’aire d’un rectangle, puis affiche aire(5, 4). Résultat attendu : « 20 ».',
          starter: '# définis aire puis affiche aire(5, 4)\n',
          expected: '20',
          hint: 'def aire(l, L):\n    return l * L\n\nprint(aire(5, 4))',
        },
        quiz: [
          { q: 'Quel mot-clé définit une fonction ?', options: ['function', 'def', 'func'], answer: 1 },
          { q: 'Que fait return ?', options: ['Affiche', 'Renvoie une valeur', 'Boucle'], answer: 1 },
          { q: 'Une fonction peut-elle être appelée plusieurs fois ?', options: ['Non', 'Oui', 'Seulement deux fois'], answer: 1 },
        ],
      },
      {
        id: 'py-listes',
        title: 'Listes et parcours',
        minutes: 9,
        intro: [
          'Une liste range plusieurs valeurs dans une seule variable : notes = [12, 15, 9]. On accède aux éléments par index, en commençant à zéro : notes[0] vaut 12.',
          'Les fonctions intégrées sum(), max(), min(), len() font des miracles sur les listes. Et for note in notes parcourt chaque élément sans se soucier des indexes.',
        ],
        keyPoints: [
          'notes[0] est le premier élément, notes[-1] le dernier.',
          'sum(notes) additionne, len(notes) compte.',
          'for x in liste : parcourt tous les éléments.',
          'liste.append(v) ajoute à la fin.',
        ],
        widget: {
          type: 'python',
          task: 'Avec notes = [12, 15, 9], affiche la somme puis le maximum séparés par un espace (« 36 15 »).',
          starter: 'notes = [12, 15, 9]\n',
          expected: '36 15',
          hint: 'print(sum(notes), max(notes))',
        },
        quiz: [
          { q: 'Quel est l’index du premier élément ?', options: ['1', '0', '-1'], answer: 1 },
          { q: 'Que renvoie len([12, 15, 9]) ?', options: ['36', '2', '3'], answer: 2 },
          { q: 'Quelle fonction ajoute un élément à la fin ?', options: ['add()', 'push()', 'append()'], answer: 2 },
        ],
      },
      {
        id: 'py-chaines',
        title: 'Chaînes de caractères',
        minutes: 8,
        intro: [
          'Une chaîne ("texte") est une séquence : on connaît sa longueur avec len(), on la découpe avec [début:fin], on la transforme avec .upper(), .lower(), .replace().',
          'Les f-strings insèrent des variables dans du texte : f"Moyenne : {m}" : l’outil parfait pour des messages lisibles.',
        ],
        keyPoints: [
          'len("BAC") vaut 3.',
          'mot.lower() met en minuscules, .upper() en majuscules.',
          'f"Score : {x}" injecte la valeur de x.',
          'On ne modifie jamais une chaîne sur place : chaque méthode renvoie une nouvelle chaîne.',
        ],
        widget: {
          type: 'python',
          task: 'Avec mot = "BAC", affiche le mot en minuscules puis sa longueur séparés par un espace (« bac 3 »).',
          starter: 'mot = "BAC"\n',
          expected: 'bac 3',
          hint: 'print(mot.lower(), len(mot))',
        },
        quiz: [
          { q: 'Que renvoie len("BAC2026") ?', options: ['6', '7', '3'], answer: 1 },
          { q: 'Que produit f"Note : {15}" ?', options: ['Note : 15', 'Note : {15}', 'Erreur'], answer: 0 },
          { q: 'mot.upper() modifie mot sur place ?', options: ['Vrai', 'Faux, il renvoie une copie', 'Faux, il plante'], answer: 1 },
        ],
      },
      {
        id: 'py-projet',
        title: 'Mini-projet : calculer une moyenne',
        minutes: 12,
        intro: [
          'Assemblons tout : une moyenne de notes se calcule en additionnant (sum), en comptant (len), en divisant, puis en arrondissant avec round(valeur, 2).',
          'Ce mini-programme est exactement celui que tu pourras brancher sur tes vraies notes. Complète-le, exécute, ajuste : c’est ça, développer.',
        ],
        keyPoints: [
          'Moyenne = somme des valeurs ÷ nombre de valeurs.',
          'round(13.5, 2) garde 2 décimales.',
          'Compose les fonctions : round(sum(notes) / len(notes), 2).',
          'Teste toujours avec un cas dont tu connais le résultat.',
        ],
        widget: {
          type: 'python',
          task: 'Calcule la moyenne de notes = [12, 15, 9, 18] et affiche-la arrondie à 2 décimales. Attendu : « 13.5 ».',
          starter: 'notes = [12, 15, 9, 18]\n# calcule et affiche la moyenne\n',
          expected: '13.5',
          hint: 'm = sum(notes) / len(notes)\nprint(round(m, 2))',
        },
        quiz: [
          { q: 'Comment calcule-t-on une moyenne ?', options: ['max ÷ 2', 'somme ÷ nombre', 'nombre × somme'], answer: 1 },
          { q: 'Que fait round(v, 2) ?', options: ['Arrondit à 2 décimales', 'Multiplie par 2', 'Prend les 2 premiers chiffres'], answer: 0 },
          { q: 'sum([12, 15, 9, 18]) vaut…', options: ['54', '52', '48'], answer: 0 },
        ],
      },
    ],
  },
  {
    id: 'physique',
    title: 'Physique : voir pour comprendre',
    tagline: 'Des simulations interactives pour sentir les lois du monde.',
    color: '#5fb87e',
    lessons: [
      {
        id: 'ph-projectile',
        title: 'Le mouvement de projectile',
        minutes: 10,
        intro: [
          'Lance un objet en biais : son mouvement est la composition de deux mouvements simples : horizontal à vitesse constante, vertical accéléré par g = 9,81 m/s².',
          'Portée maximale ? Pour une vitesse donnée, elle est atteinte à 45°. Joue avec les curseurs : observe comment l’angle arbitre entre hauteur et distance.',
          'Les formules du cours deviennent visibles : portée = v₀²·sin(2θ)/g, flèche = v₀²·sin²(θ)/(2g).',
        ],
        keyPoints: [
          'La vitesse horizontale reste constante (pas de frottements).',
          'La vitesse verticale change de signe au sommet.',
          'À 45°, la portée est maximale.',
          'Trajectoire parabolique : y = x·tan θ − g·x²/(2v₀²cos²θ).',
        ],
        widget: { type: 'projectile' },
        quiz: [
          { q: 'Pour quel angle la portée est-elle maximale (sans frottements) ?', options: ['30°', '45°', '60°'], answer: 1 },
          { q: 'Au sommet de la trajectoire, la vitesse verticale est…', options: ['Maximale', 'Nulle', 'Négative'], answer: 1 },
          { q: 'Que devient la trajectoire si g diminue (Lune) ?', options: ['Plus courte', 'Identique', 'Plus longue et haute'], answer: 2 },
        ],
      },
      {
        id: 'ph-pendule',
        title: 'Le pendule et la période',
        minutes: 10,
        intro: [
          'Un pendule qui oscille garde un tempo étonnamment régulier : T = 2π√(L/g). La période dépend de la longueur L… et pas de la masse ! Galilée l’avait remarqué à la cathédrale de Pise.',
          'Petits angles seulement : la formule suppose des oscillations de moins de ~15°. Augmente l’amplitude dans la simulation et regarde la période réelle s’écarter légèrement de la théorie.',
          'Horloges à balancier, métronomes, détecteurs sismiques : le même principe partout.',
        ],
        keyPoints: [
          'T = 2π√(L/g) : doubler L multiplie T par √2.',
          'La masse n’influence pas la période.',
          'Petits angles : isochronisme des oscillations.',
          'L’amortissement (frottements) fait mourir l’amplitude, pas la période.',
        ],
        widget: { type: 'pendule' },
        quiz: [
          { q: 'Si on quadruple L, la période…', options: ['Double', 'Quadruple', 'Ne change pas'], answer: 0 },
          { q: 'Changer la masse du pendule change…', options: ['La période', 'Rien sur la période', 'La gravité'], answer: 1 },
          { q: 'La formule T = 2π√(L/g) est valide pour…', options: ['Tout angle', 'Petits angles', 'Aucun angle'], answer: 1 },
        ],
      },
      {
        id: 'ph-orbites',
        title: 'Gravitation et orbites',
        minutes: 11,
        intro: [
          'Pourquoi la Lune ne tombe-t-elle pas ? Elle tombe, en permanence, mais sa vitesse latérale la fait rater la Terre. C’est ça, une orbite : une chute perpétuelle.',
          'Selon la vitesse initiale, la trajectoire est un cercle, une ellipse, une parabole (vitesse limite) ou une hyperbole (évasion). Newton l’a démontré avec la loi F = G·m·M/r².',
          'Dans la simulation, essaie la « vitesse circulaire » exacte, puis dépasse-la doucement : tu verras naître une ellipse. Trop vite ? Évasion.',
        ],
        keyPoints: [
          'Une orbite est une chute libre ratée.',
          'vitesse ↑ ⇒ orbite plus excentrique, voire évasion.',
          'Loi de gravitation : F = G·m·M/r².',
          'Orbite circulaire : v = √(G·M/r), ni plus ni moins.',
        ],
        widget: { type: 'orbites' },
        quiz: [
          { q: 'Une orbite est…', options: ['Un équilibre de forces nulles', 'Une chute perpétuelle ratée', 'Une poussée constante'], answer: 1 },
          { q: 'Si la distance r double, la force gravitationnelle…', options: ['Double', 'Est divisée par 2', 'Est divisée par 4'], answer: 2 },
          { q: 'Dépasser la vitesse d’évasion signifie…', options: ['Tomber plus vite', 'Quitter l’attraction pour toujours', 'Rester en orbite'], answer: 1 },
        ],
      },
    ],
  },
  {
    id: 'maths',
    title: 'Maths : manipuler pour maîtriser',
    tagline: 'Courbes, cercle trigo et dérivées sous tes doigts.',
    color: '#d4a05a',
    lessons: [
      {
        id: 'ma-grapheur',
        title: 'Fonctions et courbes',
        minutes: 9,
        intro: [
          'Une fonction f associe à chaque x une seule image f(x). Sa courbe raconte tout d’un coup d’œil : croissance, maximum, racines (où elle coupe l’axe des x).',
          'Déplace les curseurs : le a de ax² ouvre ou ferme la parabole, le b la translate obliquement, le c la monte ou la descend. Prédire AVANT de bouger : c’est ça, comprendre.',
        ],
        keyPoints: [
          'ax² + bx + c : a contrôle l’ouverture de la parabole.',
          'Les racines de f sont les points où f(x) = 0.',
          'sin(b·x) : b comprime ou étire la vague.',
          'c translate la courbe verticalement.',
        ],
        widget: { type: 'grapheur' },
        quiz: [
          { q: 'Si a < 0 dans ax² + bx + c, la parabole…', options: ['Monte', 'Est inversée (bosse)', 'Disparaît'], answer: 1 },
          { q: 'Une racine de f est une solution de…', options: ['f(x) = 1', 'f(x) = 0', 'x = 0'], answer: 1 },
          { q: 'Augmenter b dans sin(b·x)…', options: ['Étire la vague', 'Comprime la vague', 'Déplace la vague'], answer: 1 },
        ],
      },
      {
        id: 'ma-cercle',
        title: 'Le cercle trigonométrique',
        minutes: 9,
        intro: [
          'Sur le cercle de rayon 1, un angle θ définit un point unique : son abscisse est cos θ, son ordonnée est sin θ. Tout le cours de trigo tient dans cette phrase.',
          'Anime le curseur : cosinus et sinus deviennent des ombres qui respirent sur les axes. Les angles remarquables (0°, 30°, 45°, 60°, 90°) se lisent directement.',
          'Et tan θ = sin θ / cos θ : la pente de la droite qui relie l’origine au point du cercle.',
        ],
        keyPoints: [
          'cos θ = abscisse, sin θ = ordonnée du point du cercle unité.',
          'cos²θ + sin²θ = 1 (Pythagore sur le cercle).',
          'Période 360° : sin(θ + 360°) = sin θ.',
          'tan θ = sin θ / cos θ.',
        ],
        widget: { type: 'cercle-trigo' },
        quiz: [
          { q: 'Sur le cercle unité, sin θ correspond à…', options: ["L'abscisse", "L'ordonnée", 'Le rayon'], answer: 1 },
          { q: 'cos²θ + sin²θ vaut…', options: ['0', '1', 'θ'], answer: 1 },
          { q: 'sin(90°) vaut…', options: ['0', '1', '-1'], answer: 1 },
        ],
      },
      {
        id: 'ma-tangente',
        title: 'Dérivées et tangentes',
        minutes: 10,
        intro: [
          'La dérivée f′(a) est la pente de la tangente à la courbe au point a : de combien f change quand x bouge un tout petit peu. Croissante ⇒ f′ > 0. Sommet ⇒ f′ = 0.',
          'Glisse le point sur la courbe : la tangente pivote. Quand elle s’horizontalise, tu passes par un extremum : voilà pourquoi f′ = 0 cherche les maxima et minima.',
          'Exemples utiles : (xⁿ)′ = n·xⁿ⁻¹, donc (x³)′ = 3x², et (kx)′ = k.',
        ],
        keyPoints: [
          "f′(a) = pente de la tangente en x = a.",
          'f′ > 0 : la fonction croît ; f′ < 0 : elle décroît.',
          'Extremum local ⇒ tangente horizontale (f′ = 0).',
          '(xⁿ)′ = n·xⁿ⁻¹.',
        ],
        widget: { type: 'tangente' },
        quiz: [
          { q: "Géométriquement, f′(a) représente…", options: ["L'aire sous la courbe", 'La pente de la tangente', 'f(a)'], answer: 1 },
          { q: 'Si f′ > 0 sur un intervalle, f y est…', options: ['Décroissante', 'Croissante', 'Constante'], answer: 1 },
          { q: 'La dérivée de x³ est…', options: ['3x²', 'x²', '3x'], answer: 0 },
        ],
      },
    ],
  },
]

export const ALL_LESSONS: Lesson[] = TRACKS.flatMap((t) => t.lessons)

export function lessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id)
}

export function trackOf(lessonId: string): Track | undefined {
  return TRACKS.find((t) => t.lessons.some((l) => l.id === lessonId))
}

// XP awarded for completing a lesson: 50 base + up to 50 bonus by quiz score.
export function xpForLesson(score: number): number {
  return 50 + Math.round((Math.max(0, Math.min(100, score)) / 100) * 50)
}

const LEVEL_TITLES = ['Débutant', 'Apprenti', 'Explorateur', 'Confirmé', 'Expert', 'Maître', 'Légende']

// Cumulative XP needed to *reach* level n is 45*(n-1)*n.
export function levelForXp(xp: number): number {
  let level = 1
  while (xp >= 45 * level * (level + 1)) level++
  return level
}

export function levelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
}

export function xpFloor(level: number): number {
  return 45 * (level - 1) * level
}

export function xpCeil(level: number): number {
  return 45 * level * (level + 1)
}

export type Badge = { id: string; label: string; description: string }

export const BADGES: Badge[] = [
  { id: 'premier-pas', label: 'Premier pas', description: 'Terminer une première leçon' },
  { id: 'parfait', label: 'Sans faute', description: 'Obtenir 100 % à un quiz' },
  { id: 'code-debutant', label: 'Initié du code', description: 'Finir la piste Code : premiers pas' },
  { id: 'pythoniste', label: 'Pythoniste', description: 'Finir toute la piste Python' },
  { id: 'physicien', label: 'Physicien', description: 'Finir toute la piste Physique' },
  { id: 'mathematicien', label: 'Mathématicien', description: 'Finir toute la piste Maths' },
  { id: 'marathon', label: 'Marathon', description: 'Terminer 5 leçons' },
  { id: 'academie', label: 'Académie complète', description: 'Terminer toutes les leçons' },
]

export function earnedBadges(completions: { lessonId: string; score: number }[]): Set<string> {
  const ids = new Set(completions.map((c) => c.lessonId))
  const out = new Set<string>()
  if (ids.size >= 1) out.add('premier-pas')
  if (completions.some((c) => c.score === 100)) out.add('parfait')
  if (ids.size >= 5) out.add('marathon')
  const doneAll = (tid: TrackId) => TRACKS.find((t) => t.id === tid)!.lessons.every((l) => ids.has(l.id))
  if (doneAll('code')) out.add('code-debutant')
  if (doneAll('python')) out.add('pythoniste')
  if (doneAll('physique')) out.add('physicien')
  if (doneAll('maths')) out.add('mathematicien')
  if (ALL_LESSONS.every((l) => ids.has(l.id))) out.add('academie')
  return out
}
