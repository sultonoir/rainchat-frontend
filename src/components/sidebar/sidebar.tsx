import Image from "next/image";
import { FormLogout } from "../form/logout/form-logout";
import { UserDropdown } from "../user/user-dropdown";
import { SidebarContent } from "./sidebar-content";

export function Sidebar() {
  return (
    <div className="flex h-full w-full flex-col border-r border-border/40">
      <div className="flex flex-none items-center gap-2 p-4 pb-2">
        <Image src="/logo.png" width={40} height={40} alt="logo" />
        <h2 className="text-xl font-bold text-white">Rainchat</h2>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto">
        <SidebarContent />
        <SidebarContent />
        <SidebarContent />
        <SidebarContent />
        <SidebarContent />
        <SidebarContent />
        <SidebarContent />
        <SidebarContent />
        <SidebarContent />
      </div>
      <div className="flex flex-none items-center justify-between p-4 pt-0">
        <UserDropdown />
        <FormLogout />
      </div>
    </div>
  );
}
