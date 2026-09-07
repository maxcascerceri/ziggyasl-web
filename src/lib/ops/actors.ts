import { ACTORS, type Actor } from "./types";

export function parseActor(value: string | null | undefined): Actor {
  if (value && (ACTORS as readonly string[]).includes(value)) {
    return value as Actor;
  }
  return "Bernie";
}
