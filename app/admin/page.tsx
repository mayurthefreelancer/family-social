export const dynamic = "force-dynamic";

import { requireSuperadmin } from "@/app/lib/auth";
import { pool } from "@/app/lib/db";
import {
  AdminDashboardView,
  FamilyOverview,
  UserOverview,
  InviteOverview,
  AuditLogOverview,
  AdminTicketOverview,
  PlatformStats,
} from "@/app/components/admin/AdminDashboardView";

export default async function SuperadminPage() {
  const superadmin = await requireSuperadmin();

  // 1. Operational Governance & Raised Tickets
  const ticketsRes = await pool.query(
    `
    SELECT
      t.id,
      t.ticket_code,
      t.family_id,
      f.name AS family_name,
      t.requester_email,
      t.category,
      t.priority,
      t.status,
      t.subject,
      t.description,
      t.target_entity_type,
      t.target_entity_id,
      t.resolution_note,
      t.resolved_at,
      u_resolver.name AS resolver_name,
      t.created_at,
      t.updated_at
    FROM admin_tickets t
    LEFT JOIN families f ON f.id = t.family_id
    LEFT JOIN users u_resolver ON u_resolver.id = t.resolved_by
    ORDER BY
      CASE
        WHEN t.status = 'open' THEN 1
        WHEN t.status = 'in_progress' THEN 2
        ELSE 3
      END,
      CASE
        WHEN t.priority = 'critical' THEN 1
        WHEN t.priority = 'high' THEN 2
        WHEN t.priority = 'medium' THEN 3
        ELSE 4
      END,
      t.created_at DESC
    LIMIT 100
    `
  );

  // 2. Holistic Sovereign Families Directory
  const familiesRes = await pool.query(
    `
    SELECT
      f.id,
      f.name,
      f.description,
      f.avatar_url,
      f.backdrop_url,
      f.created_at,
      u.name AS creator_name,
      u.email AS creator_email,
      (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id)::int AS members_count,
      (SELECT COUNT(*) FROM posts p WHERE p.family_id = f.id)::int AS posts_count,
      (SELECT COUNT(*) FROM invites i WHERE i.family_id = f.id AND i.used_at IS NULL AND i.expires_at > now())::int AS active_invites_count
    FROM families f
    LEFT JOIN users u ON u.id = f.created_by
    ORDER BY f.created_at DESC
    `
  );

  // 3. Platform Users Directory (all users, multi-family memberships, contributions)
  const usersRes = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.avatar_url,
      u.is_superadmin,
      u.created_at,
      (
        SELECT COALESCE(json_agg(
          json_build_object(
            'family_id', f.id,
            'family_name', f.name,
            'role', fm.role
          )
        ), '[]'::json)
        FROM family_members fm
        JOIN families f ON f.id = fm.family_id
        WHERE fm.user_id = u.id
      ) AS memberships,
      (SELECT COUNT(*) FROM posts p WHERE p.user_id = u.id)::int AS posts_count,
      (SELECT COUNT(*) FROM comments c WHERE c.user_id = u.id)::int AS comments_count
    FROM users u
    ORDER BY u.created_at DESC
    `
  );

  // 4. Platform Invites Ledger
  const invitesRes = await pool.query(
    `
    SELECT
      i.id,
      i.token,
      i.expires_at,
      i.used_at,
      i.created_at,
      f.name AS family_name,
      COALESCE(u.name, 'Admin') AS creator_name
    FROM invites i
    JOIN families f ON f.id = i.family_id
    LEFT JOIN users u ON u.id = i.created_by
    ORDER BY i.created_at DESC
    LIMIT 50
    `
  );

  // 5. Platform Security & Audit Trail
  const auditRes = await pool.query(
    `
    SELECT
      al.id,
      al.action,
      al.entity_type,
      al.entity_id,
      al.created_at,
      f.name AS family_name,
      u.name AS actor_name
    FROM audit_logs al
    LEFT JOIN families f ON f.id = al.family_id
    LEFT JOIN users u ON u.id = al.actor_user_id
    ORDER BY al.created_at DESC
    LIMIT 50
    `
  );

  // 6. Aggregate Platform Telemetry Metrics
  const statsRes = await pool.query(
    `
    SELECT
      (SELECT COUNT(*) FROM families)::int AS total_families,
      (SELECT COUNT(*) FROM users)::int AS total_users,
      (SELECT COUNT(*) FROM family_members)::int AS total_members,
      (SELECT COUNT(*) FROM posts)::int AS total_posts,
      (SELECT COUNT(*) FROM comments)::int AS total_comments,
      (SELECT COUNT(*) FROM invites)::int AS total_invites,
      (SELECT COUNT(*) FROM invites WHERE used_at IS NULL AND expires_at > now())::int AS active_invites,
      (SELECT COUNT(*) FROM admin_tickets)::int AS total_tickets,
      (SELECT COUNT(*) FROM admin_tickets WHERE status = 'open')::int AS open_tickets,
      (SELECT COUNT(*) FROM admin_tickets WHERE status = 'resolved')::int AS resolved_tickets
    `
  );

  const stats: PlatformStats = {
    totalFamilies: statsRes.rows[0]?.total_families || 0,
    totalUsers: statsRes.rows[0]?.total_users || 0,
    totalMembers: statsRes.rows[0]?.total_members || 0,
    totalPosts: statsRes.rows[0]?.total_posts || 0,
    totalComments: statsRes.rows[0]?.total_comments || 0,
    totalInvites: statsRes.rows[0]?.total_invites || 0,
    activeInvites: statsRes.rows[0]?.active_invites || 0,
    totalTickets: statsRes.rows[0]?.total_tickets || 0,
    openTickets: statsRes.rows[0]?.open_tickets || 0,
    resolvedTickets: statsRes.rows[0]?.resolved_tickets || 0,
  };

  return (
    <AdminDashboardView
      tickets={ticketsRes.rows as AdminTicketOverview[]}
      families={familiesRes.rows as FamilyOverview[]}
      users={usersRes.rows as UserOverview[]}
      invites={invitesRes.rows as InviteOverview[]}
      auditLogs={auditRes.rows as AuditLogOverview[]}
      stats={stats}
      currentUserId={superadmin.id}
    />
  );
}
