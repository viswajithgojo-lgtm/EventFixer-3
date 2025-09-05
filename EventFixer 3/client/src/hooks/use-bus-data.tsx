import { useQuery } from "@tanstack/react-query";
import { type Bus } from "@shared/schema";

export function useBuses() {
  return useQuery<Bus[]>({
    queryKey: ['/api/buses'],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
}

export function useBus(busId: string) {
  return useQuery<Bus>({
    queryKey: ['/api/buses', busId],
    refetchInterval: 30000,
  });
}
