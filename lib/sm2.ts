/**
 * SM-2 spaced repetition algorithm (Piotr Wozniak, 1985).
 *
 * Each review grades the recall on 0-5:
 *   0 = complete blackout
 *   1 = incorrect, but remembered once shown
 *   2 = incorrect, easy to recall once shown
 *   3 = correct with difficulty
 *   4 = correct after hesitation
 *   5 = perfect recall
 *
 * Below 3 fails the card and resets repetitions to 0.
 */

export interface Sm2State {
  ease: number
  intervalDays: number
  repetitions: number
  dueAt: Date
}

export const SM2_DEFAULT_STATE: Sm2State = {
  ease: 2.5,
  intervalDays: 0,
  repetitions: 0,
  dueAt: new Date(),
}

export function sm2Next(state: Sm2State, quality: number, now: Date = new Date()): Sm2State {
  const q = Math.max(0, Math.min(5, Math.round(quality)))
  let { ease, intervalDays, repetitions } = state

  if (q < 3) {
    repetitions = 0
    intervalDays = 1
  } else {
    if (repetitions === 0) intervalDays = 1
    else if (repetitions === 1) intervalDays = 6
    else intervalDays = Math.round(intervalDays * ease)
    repetitions += 1
  }

  // Update ease (only for >= 3 quality)
  if (q >= 3) {
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
  } else {
    ease = Math.max(1.3, ease - 0.2)
  }

  const dueAt = new Date(now)
  dueAt.setDate(dueAt.getDate() + intervalDays)

  return { ease, intervalDays, repetitions, dueAt }
}

/**
 * Map user-friendly button to SM-2 quality.
 *   again   → 1 (forgot)
 *   hard    → 3 (correct with difficulty)
 *   good    → 4
 *   easy    → 5
 */
export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

export function ratingToQuality(rating: ReviewRating): number {
  switch (rating) {
    case 'again': return 1
    case 'hard': return 3
    case 'good': return 4
    case 'easy': return 5
  }
}