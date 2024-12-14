import { cn } from "../utils/cn";
import { COLORS } from "../utils/constants";

interface AvatarProps {
  zIndex?: number;
  className?: string;
  name: string;
  userID: string;
}

const getColor = (hash: string) => {
  return COLORS[hash.charCodeAt(hash.length - 1) % COLORS.length];
};

export const Avatar = ({ zIndex, className, name, userID }: AvatarProps) => {
  return (
    <div
      className={cn(
        "size-8 rounded-full flex flex-col items-center justify-center",
        className,
      )}
      style={{ backgroundColor: getColor(userID), zIndex }}
    >
      {name ? name[0] : "?"}
    </div>
  );
};
