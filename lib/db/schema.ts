import { pgTable, text, timestamp, integer, boolean, uuid, pgEnum, customType } from 'drizzle-orm/pg-core'

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return 'bytea'
  },
})

export const themePreferenceEnum = pgEnum('theme_preference', ['light', 'dark', 'system'])
export const accentColorEnum = pgEnum('accent_color', ['coral', 'indigo', 'emerald', 'amber', 'violet', 'rose'])

export const user = pgTable('user', {
  id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false), image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const userPreferences = pgTable('user_preferences', {
  userId: text('user_id').primaryKey().references(() => user.id, { onDelete: 'cascade' }),
  themePreference: themePreferenceEnum('theme_preference').notNull().default('system'),
  accentColor: accentColorEnum('accent_color').notNull().default('coral'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
export const session = pgTable('session', {
  id: text('id').primaryKey(), expiresAt: timestamp('expiresAt').notNull(), token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'), userAgent: text('userAgent'), userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})
export const account = pgTable('account', {
  id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }), accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), issuer: text('issuer'),
  createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
export const verification = pgTable('verification', {
  id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(), updatedAt: timestamp('updatedAt').defaultNow(),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), title: text('title').notNull(), subject: text('subject'), priority: text('priority').notNull().default('medium'), status: text('status').notNull().default('todo'), dueAt: timestamp('due_at', { withTimezone: true }), estimatedMinutes: integer('estimated_minutes').notNull().default(25), completedAt: timestamp('completed_at', { withTimezone: true }), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
export const exams = pgTable('exams', { id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), title: text('title').notNull(), subject: text('subject').notNull(), examAt: timestamp('exam_at', { withTimezone: true }).notNull(), preparationPercent: integer('preparation_percent').notNull().default(0), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull() })
export const focusSessions = pgTable('focus_sessions', { id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), taskId: uuid('task_id'), durationMinutes: integer('duration_minutes').notNull(), status: text('status').notNull().default('planned'), startedAt: timestamp('started_at', { withTimezone: true }), completedAt: timestamp('completed_at', { withTimezone: true }), interruptions: integer('interruptions').notNull().default(0) })
export const notificationPreferences = pgTable('notification_preferences', { userId: text('user_id').primaryKey(), reminders: boolean('reminders').notNull().default(true), examAlerts: boolean('exam_alerts').notNull().default(true), quietStart: text('quiet_start').notNull().default('22:00'), quietEnd: text('quiet_end').notNull().default('07:00'), updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull() })
export const pushSubscriptions = pgTable('push_subscriptions', { id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), endpoint: text('endpoint').notNull(), p256dh: text('p256dh').notNull(), auth: text('auth').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull() })
export const learningDocuments = pgTable('learning_documents', { id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), subject: text('subject'), filename: text('filename').notNull(), mimeType: text('mime_type').notNull(), status: text('status').notNull().default('uploaded'), data: bytea('data'), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull() })
export const aiConversations = pgTable('ai_conversations', { id: uuid('id').defaultRandom().primaryKey(), userId: text('user_id').notNull(), title: text('title').notNull().default('Nouvelle conversation'), subject: text('subject'), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull() })
