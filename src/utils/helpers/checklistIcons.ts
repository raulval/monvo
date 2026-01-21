import {
  Plane,
  Home,
  Heart,
  ClipboardList,
  BriefcaseBusiness,
} from "lucide-react-native";

export type ChecklistIconName =
  | "plane"
  | "home"
  | "heart"
  | "meeting"
  | "default";

export const checklistIconMap: Record<
  ChecklistIconName,
  React.ComponentType<{ size?: number; color?: string }>
> = {
  plane: Plane,
  home: Home,
  heart: Heart,
  meeting: BriefcaseBusiness,
  default: ClipboardList,
};