import { db } from '../lib/db'
import { tasks, exams } from '../lib/db/schema'
import { like } from 'drizzle-orm'

async function clean() {
  console.log('Cleaning mock data...')
  try {
    const deletedTasks = await db.delete(tasks).where(like(tasks.title, 'exemple — %'))
    console.log('Deleted tasks:', deletedTasks)
    const deletedExams = await db.delete(exams).where(like(exams.title, 'exemple — %'))
    console.log('Deleted exams:', deletedExams)
    console.log('Database cleaned successfully!')
  } catch (error) {
    console.error('Error cleaning database:', error)
  }
  process.exit(0)
}

clean()
