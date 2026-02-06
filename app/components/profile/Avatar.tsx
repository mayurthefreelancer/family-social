export function Avatar({ avatar, name, size = "md"}: { avatar?: string; name: string; size?: "sm" | "md" | "lg" }) {
  if (!avatar) {
    return <InitialsAvatar name={name} size={size} />
  }

  return (
    <img
      src={avatar}
      className={`h-16 w-16 rounded-full object-cover ${size === "sm" ? "h-8 w-8" : size === "lg" ? "h-24 w-24" : ""}`}
      alt={name}
    />
  )
}

function InitialsAvatar({ name, size }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
  return (
    <div className={`h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold ${size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-24 w-24 text-xl" : ""}`}>
      {initials}
    </div>
  )
}