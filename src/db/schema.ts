import { pgTable, text, timestamp, integer, boolean, real } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  accountType: text('account_type').notNull(),
  riskScore: integer('risk_score').notNull(),
  status: text('status').notNull(),
  joinedDate: text('joined_date').notNull(),
  balance: real('balance').notNull(),
});

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  customerName: text('customer_name').notNull(),
  accountNumber: text('account_number').notNull(),
  type: text('type').notNull(),
  amount: real('amount').notNull(),
  riskScore: integer('risk_score').notNull(),
  status: text('status').notNull(),
  timestamp: text('timestamp').notNull(),
  location: text('location').notNull(),
  device: text('device').notNull(),
  destination: text('destination').notNull(),
  isAnomalous: boolean('is_anomalous').notNull().default(false),
  flaggedReason: text('flagged_reason'),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  timestamp: text('timestamp').notNull(),
  actor: text('actor').notNull(),
  role: text('role').notNull(),
  action: text('action').notNull(),
  details: text('details').notNull(),
  severity: text('severity').notNull(),
  ipAddress: text('ip_address').notNull(),
});

export const supportTickets = pgTable('support_tickets', {
  id: text('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role').notNull(),
  senderEmail: text('sender_email').notNull(),
  category: text('category').notNull(),
  priority: text('priority').notNull(),
  status: text('status').notNull(),
  subject: text('subject').notNull(),
  description: text('description').notNull(),
  relatedTxId: text('related_tx_id'),
  timestamp: text('timestamp').notNull(),
  adminReplies: text('admin_replies'), // JSON stringified array
});

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(),
  severity: text('severity').notNull(),
  timestamp: text('timestamp').notNull(),
  read: boolean('read').notNull().default(false),
});
