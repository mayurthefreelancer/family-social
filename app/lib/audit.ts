import { pool } from "./db";
import type { PoolClient } from "pg";

type AuditLogInput = {
  familyId: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, any>;
  client?: PoolClient | any;
};

export async function logAuditEvent(input: AuditLogInput) {
  const {
    familyId,
    actorUserId,
    action,
    entityType,
    entityId,
    metadata,
    client,
  } = input;

  try {
    const db = client || pool;
    await db.query(
      `
      INSERT INTO audit_logs (
        family_id,
        actor_user_id,
        action,
        entity_type,
        entity_id,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        familyId,
        actorUserId ?? null,
        action,
        entityType,
        entityId ?? null,
        metadata ? JSON.stringify(metadata) : null,
      ]
    );
  } catch (err) {
    console.error("[logAuditEvent] Warning: Failed to record audit log event:", err);
  }
}

export async function getAuditLogs(familyId: string, limit = 50) {
  const res = await pool.query(
    `
    SELECT
      audit_logs.*,
      users.name AS actor_name
    FROM audit_logs
    LEFT JOIN users ON users.id = audit_logs.actor_user_id
    WHERE family_id = $1
    ORDER BY created_at DESC
    LIMIT $2
    `,
    [familyId, limit]
  );

  return res.rows;
}
