import Link from 'next/link'
import { ArrowLeft, Scale, ShieldCheck, Database, BellRing } from 'lucide-react'

const sections = [
  {
    id: 'mentions',
    icon: Scale,
    label: 'Mentions légales',
    title: 'Qui sommes-nous',
    body: (
      <>
        <p>OnTrack est édité par Utachi Labs. Le service est fourni tel quel, à titre gratuit, dans le cadre de la préparation au BAC français.</p>
        <p>Pour toute question, écris-nous à <a href="mailto:contact@ontrack.bac">contact@ontrack.bac</a>.</p>
      </>
    ),
  },
  {
    id: 'conditions',
    icon: ShieldCheck,
    label: "Conditions d'utilisation",
    title: "Les règles du service",
    body: (
      <>
        <p>OnTrack est un espace privé pour t'organiser. Tu t'engages à :</p>
        <ul>
          <li>Fournir des informations exactes lors de ton inscription.</li>
          <li>Ne pas tenter d'accéder aux données d'autres utilisateurs.</li>
          <li>Ne pas utiliser le service pour publier du contenu illicite.</li>
        </ul>
        <p>Nous pouvons suspendre un compte en cas d'usage abusif. Tu peux supprimer ton compte à tout moment depuis les réglages.</p>
      </>
    ),
  },
  {
    id: 'confidentialite',
    icon: Database,
    label: 'Politique de confidentialité',
    title: 'Tes données, ton contrôle',
    body: (
      <>
        <p>OnTrack stocke uniquement ce qui est nécessaire au service :</p>
        <ul>
          <li>Adresse e-mail, nom et mot de passe (chiffré).</li>
          <li>Tâches, examens, sessions de focus que tu crées.</li>
          <li>Documents que tu importes (PDF/TXT), stockés de manière isolée.</li>
          <li>Progression des leçons, scores et badges.</li>
        </ul>
        <p>Les données sont hébergées sur Neon (Postgres managé) en Europe. Aucune donnée n'est revendue. Aucune publicité, aucun tracker tiers.</p>
        <p>Conformément au RGPD, tu peux demander l'export ou la suppression de tes données à <a href="mailto:contact@ontrack.bac">contact@ontrack.bac</a>.</p>
      </>
    ),
  },
  {
    id: 'notifications',
    icon: BellRing,
    label: 'Notifications',
    title: 'Recevoir des rappels',
    body: (
      <>
        <p>OnTrack peut t'envoyer des notifications push pour les rappels d'examens et les fins de sessions de focus.</p>
        <p>Tu peux activer ou désactiver les notifications à tout moment depuis les réglages ou les paramètres de ton navigateur.</p>
        <p>Aucune donnée n'est partagée avec des partenaires publicitaires. Les notifications sont envoyées via le standard Web Push (VAPID).</p>
      </>
    ),
  },
]

export default function LegalPage() {
  return (
    <main className="legal-page">
      <header className="legal-header">
        <Link href="/" className="legal-back"><ArrowLeft size={14} /> Retour à l’accueil</Link>
        <span className="legal-eyebrow">Mentions &amp; politiques</span>
      </header>

      <div className="legal-shell">
        <h1 className="legal-title">OnTrack en clair.</h1>
        <p className="legal-intro">
          Ce que tu acceptes, ce que nous gardons, comment ça marche. Pas de jargon, pas de pages cachées : tout est ici.
        </p>

        <nav className="legal-toc" aria-label="Sommaire">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="legal-toc-link">
              <span className="legal-toc-icon"><s.icon size={14} aria-hidden="true" /></span>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="legal-sections">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="legal-section">
              <header className="legal-section-head">
                <span className="legal-section-icon"><s.icon size={16} aria-hidden="true" /></span>
                <h2>{s.title}</h2>
              </header>
              <div className="legal-section-body">{s.body}</div>
            </section>
          ))}
        </div>

        <footer className="legal-foot">
          <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
          <p>En utilisant OnTrack, tu acceptes ces conditions.</p>
        </footer>
      </div>
    </main>
  )
}