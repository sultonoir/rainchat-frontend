import { UserAvatar } from "./user-avatar";
import Image from "next/image";
import { Input } from "../ui/input";
import { Member } from "@/types";

interface UserCardProps {
  member: Member;
}

const defaultProfile = {
  id: new Date().getTime().toString(),
  name: "Sarah Anderson",
  userId: new Date().getTime().toString(),
  user: {
    status: "Available in 2 weeks",
    image: "/avatar.png",
    baner: "/banner.webp",
    username: "sultonoir",
    lastSeen: new Date(),
  },
};

export default function UserCard({ member = defaultProfile }: UserCardProps) {
  return (
    <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
      <div className="relative h-28 w-full">
        <Image
          alt={member.userId}
          src={member.user.baner === "" ? "/banner.webp" : member.user.baner ?? ""}
          fill
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 border-t p-4">
        <div className="flex items-start gap-6">
          <UserAvatar src={member.user.image} className="size-14" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {member.name ?? member.user.username}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {member.user.username}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-wrap text-sm text-zinc-500">{status}</p>
        <Input />
      </div>
    </div>
  );
}
