type Member = {
  id: string;
  name: string;
  role: "admin" | "member";
};

export function FamilyMemberRow({ member }: { member: Member }) {
  const isAdmin = member.role === "admin";

  return (
    <div
      className="
        member-row
        flex items-center justify-between
        px-5 py-4
        rounded-xl
        transition-all duration-200
        hover:surface-2
      "
    >
      <div className="flex items-center gap-4">
        {/* Avatar Placeholder */}
        <div
          className="
            h-10 w-10
            rounded-full
            flex items-center justify-center
            text-sm font-semibold
            bg-[var(--muted-surface)]
            text-[var(--text-secondary)]
          "
        >
          {member.name.charAt(0).toUpperCase()}
        </div>

        {/* Name + Role */}
        <div className="flex flex-col">
          <span
            className="
              font-semibold
              text-[var(--text-primary)]
              tracking-tight
            "
          >
            {member.name}
          </span>

          <span
            className={`
                w-fit
                uppercase
              role-badge
              flex items-center justify-center
              px-2.5 py-0.5
              text-xs font-medium
              rounded-full
              mt-1
              ${
                isAdmin
                  ? "badge-admin"
                  : "badge-member"
              }
            `}
          >
            {isAdmin ? "Admin" : "family Member"}
          </span>
        </div>
      </div>

      {/* Reserved space for actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Future icons */}
      </div>
    </div>
  );
}
