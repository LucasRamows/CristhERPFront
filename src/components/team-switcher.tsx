import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";

export function TeamSwitcher({
  business,
}: {
  business: {
    name: string;
    logo: string;
  };
}) {
  if (!business) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-none"
            >
              <div className="flex size-8 items-center justify-center">
                <img src={business.logo} alt="Logo" className="size-8" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{business.name}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
