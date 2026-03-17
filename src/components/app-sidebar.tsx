"use client";
import { CompassIcon, Settings } from "lucide-react";
import * as React from "react";

import { NavProjects } from "../components/nav-projects";
import { NavUser } from "../components/nav-user";
import { TeamSwitcher } from "../components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar";
import { useAuthenticatedUser } from "../contexts/DataContext";
import { sidebarNavigation } from "../lib/sidebarNavFilter";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = useAuthenticatedUser();
  console.log("e os dados", data);

  const filteredNav = sidebarNavigation.filter((item) =>
    item.roles.includes(data?.role),
  );

  const block = {
    user: {
      name: data?.name ? data.name : "Usuário",
      email: data?.email ? data.email : "Usuário",
      avatar: "/avatars/shadcn.jpg",
    },
    business: {
      name: "CristhERP",
      logo: CompassIcon,
    },
    projects: filteredNav,
    navSecondary: [
      {
        title: "Configurações",
        url: "setting",
        icon: Settings,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher business={block.business} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={block.projects} />
        <NavSecondary items={block.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={block.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
