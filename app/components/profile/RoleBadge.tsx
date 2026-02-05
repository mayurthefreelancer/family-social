export default function RoleBadge({ role }: { role: string }) {
    let roleColor = "gray";

    switch (role) {
        case "admin":
            roleColor = "red";
            break;
        case "moderator":
            roleColor = "yellow";
            break;
        case "user":
            roleColor = "green";
            break;
    }
    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold text-white bg-${roleColor}-500 rounded-full`}>
            {role}
        </span>
    );
}