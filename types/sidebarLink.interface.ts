export default interface SidebarLink {
  label: string;
  route: string;
  SvgIcon: () => JSX.Element;
  paths?: string[];
}