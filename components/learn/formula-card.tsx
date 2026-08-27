import type { FormulaCard as FormulaCardType } from '@/lib/curriculum'

export function FormulaCard({ label, formula, explanation }: FormulaCardType) {
  return (
    <div className="formula-card">
      <span className="formula-label">{label}</span>
      <div className="formula-block">
        <code>{formula}</code>
      </div>
      <p className="formula-explain">{explanation}</p>
    </div>
  )
}

export function FormulaGrid({ cards }: { cards: FormulaCardType[] }) {
  return (
    <div className="formula-grid">
      {cards.map((c, i) => (
        <FormulaCard key={i} {...c} />
      ))}
    </div>
  )
}
