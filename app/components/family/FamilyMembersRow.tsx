type Member = {
    id: string;
    name: string;
    role: "admin" | "member";
};

export function FamilyMemberRow({ member }: { member: Member }) {
    return (
        <div className="flex items-center justify-between px-4 py-3">
            <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {member.name}
                </p>
                <p className="text-xs font-semibold text-[var(--color-text-muted)]">
                    {member.role === "admin" ? <span className="text-red-500">Administrator</span> : <span className="text-blue-500">Member</span>}
                </p>
            </div>

            {/* Reserved for future admin actions */}
        </div>
    );
}
