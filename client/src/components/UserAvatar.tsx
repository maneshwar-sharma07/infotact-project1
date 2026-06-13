interface UserAvatarProps {
  name: string;
}

function UserAvatar({ name }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold">
      {initials}
    </div>
  );
}

export default UserAvatar;