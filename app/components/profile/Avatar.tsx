export function Avatar({
  avatar,
  name,
  size = "md",
}: {
  avatar?: string | null
  name: string
  size?: "sm" | "md" | "lg"
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-20 w-20",
  }

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`h-12 w-12 bg-gray-200  rounded-full flex items-center justify-center`}
    >
      <span className="font-medium text-gray-700">
        {name[0]?.toUpperCase()}
      </span>
    </div>
  )
}
