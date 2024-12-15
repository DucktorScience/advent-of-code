import { Direction, HorizontalDirection } from "./types";

export const isHorizontalDirection = (direction: Direction): direction is HorizontalDirection => direction === 'E' || direction === 'W';