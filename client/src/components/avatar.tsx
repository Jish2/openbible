interface AvatarProps {
  color: string;
  zIndex: number;
}

export const Avatar = ({ color, zIndex }: AvatarProps) => {
  return (
    <div
      className="inline-block size-8 rounded-full"
      style={{ backgroundColor: color, zIndex }}
    />
  );
};
