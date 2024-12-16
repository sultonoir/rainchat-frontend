import Image from "next/image";
import { FormLogout } from "../form/logout/form-logout";
import { UserDropdown } from "../user/user-dropdown";
import { FormCreatGroup } from "../form/group/form-create-group";
import { ChatList } from "../chat/chat-list";
import { SidebarTrigger } from "./sidebar-trigger";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col border-r border-border/40">
      <div className="flex flex-none items-center justify-between p-4 pb-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" width={40} height={40} alt="logo" priority />
          <h2 className="text-xl font-bold text-white">Rainchat</h2>
        </Link>
        <div className="flex items-center gap-2">
          <FormCreatGroup />
          <SidebarTrigger />
        </div>
      </div>
      <ChatList />
      <div className="flex flex-none items-center justify-between p-4 pt-0">
        <UserDropdown />
        <FormLogout />
      </div>
    </div>
  );
}
