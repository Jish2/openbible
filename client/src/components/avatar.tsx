import { cn } from "../utils/cn";

interface AvatarProps {
  color: string;
  zIndex?: number;
  className?: string;
}

export const Avatar = ({ color, zIndex, className }: AvatarProps) => {
  return (
    <div
      className={cn("inline-block size-8 rounded-full", className)}
      style={{ backgroundColor: color, zIndex }}
    />
  );
};
