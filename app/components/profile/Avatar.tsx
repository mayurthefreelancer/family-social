export function Avatar({ avatar, name }: { avatar?: string; name: string }) {
  if (avatar) {
    return <img src={avatar} className="h-20 w-20 rounded-full" />
  }

  return (
    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
      {name.slice(0, 1).toUpperCase()}
    </div>
  )
}
