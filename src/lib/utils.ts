import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getChannel(channel: string, type: string): number {
  if (type === "withdrawal") {
    switch (channel) {
      case "MTN":
        return 1
      case "Vodafone":
        return 6
      case "AirtelTigo":
        return 7
      default:
        return 0
    }
  } else if (type === "deposit") {
    switch (channel) {
      case "MTN":
        return 13
      case "Vodafone":
        return 6
      case "AirtelTigo":
        return 7
      default:
        return 0
    }
  } else {
    return 0
  }
}

