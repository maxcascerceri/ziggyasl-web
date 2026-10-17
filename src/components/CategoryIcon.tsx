import type { ComponentType, SVGProps } from "react";
import {
  BicepsFlexed,
  GraduationCap,
  HandHelping,
  MessageCircleQuestion,
  Palette,
  Speech,
  Thermometer,
  Apple,
  Armchair,
  Baby,
  Backpack,
  Briefcase,
  Car,
  Carrot,
  CalendarDays,
  CaseUpper,
  CircleDollarSign,
  Clock,
  CloudSun,
  Coffee,
  Compass,
  Ear,
  Egg,
  Footprints,
  Globe,
  Hand,
  Hash,
  Heart,
  HeartHandshake,
  House,
  IdCard,
  Laugh,
  Leaf,
  Lightbulb,
  Link,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Monitor,
  Music,
  PartyPopper,
  PawPrint,
  Percent,
  PersonStanding,
  Pointer,
  Quote,
  Rabbit,
  Route,
  Shirt,
  ShoppingBag,
  ShowerHead,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Stethoscope,
  Sun,
  Trophy,
  User,
  UserRound,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number }>;

/**
 * One stroke icon per dictionary category, keyed by category id. Mirrors the
 * SF Symbol the iOS app uses for the same category so the two feel related.
 */
const ICONS: Record<string, Icon> = {
  greetings: Hand,
  responses: MessageCircle,
  "casual-talk": MessagesSquare,
  pronouns: Users,
  questions: MessageCircleQuestion,
  "people-words": IdCard,
  "mood-basics": Smile,
  "deaf-world": Ear,
  alphabet: CaseUpper,
  fingerspelling: Pointer,
  numbers: Hash,
  money: CircleDollarSign,
  "amounts-math": Percent,
  "sentence-helpers": Link,
  family: Baby,
  people: User,
  movement: Footprints,
  "body-actions": BicepsFlexed,
  communication: Speech,
  "doing-helping": HandHelping,
  colors: Palette,
  descriptions: SlidersHorizontal,
  home: House,
  furniture: Armchair,
  hygiene: ShowerHead,
  chores: Sparkles,
  mealtime: Utensils,
  fruit: Apple,
  vegetables: Carrot,
  "protein-dairy": Egg,
  "snacks-drinks": Coffee,
  weekdays: CalendarDays,
  "time-of-day": Sun,
  "time-units": Clock,
  "head-face": Laugh,
  body: PersonStanding,
  symptoms: Thermometer,
  health: Stethoscope,
  personality: UserRound,
  "big-feelings": Heart,
  relationships: HeartHandshake,
  clothing: Shirt,
  accessories: Backpack,
  transportation: Car,
  directions: Compass,
  places: MapPin,
  "brands-stores": ShoppingBag,
  commute: Route,
  school: GraduationCap,
  work: Briefcase,
  "pets-farm": PawPrint,
  "wild-animals": Rabbit,
  "nature-seasons": Leaf,
  weather: CloudSun,
  sports: Trophy,
  "arts-hobbies": Music,
  holidays: PartyPopper,
  countries: Globe,
  tech: Monitor,
  "online-media": Wifi,
  "big-ideas": Lightbulb,
  "asl-phrases": Quote,
};

/** Rounded white chip with the category's icon in the tint's accent color. */
export function CategoryIcon({
  categoryId,
  size = "md",
  className = "",
}: {
  categoryId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = ICONS[categoryId] ?? Sparkles;
  const box = size === "lg" ? "h-14 w-14 rounded-2xl" : size === "sm" ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-xl";
  const px = size === "lg" ? 26 : size === "sm" ? 16 : 20;
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center bg-white/80 text-[var(--tint-icon)] shadow-[0_1px_2px_rgba(41,46,56,0.08)] ${box} ${className}`}
    >
      <Icon size={px} strokeWidth={2} />
    </span>
  );
}
