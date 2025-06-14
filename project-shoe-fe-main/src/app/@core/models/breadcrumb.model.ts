import { MenuItem } from "primeng/api";

export interface Breadcrumb extends MenuItem {
  routerLink: string;
  title?: string;
  label: string;
}
