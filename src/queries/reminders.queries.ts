import { useQuery } from '@tanstack/react-query';
import { checklistItemRepository } from '@/repositories/checklistItem.repository';

export const reminderKeys = {
  all: ['reminders'] as const,
};

export function useReminders() {
  return useQuery({
    queryKey: reminderKeys.all,
    queryFn: () =>
      checklistItemRepository.getUpcomingReminders(),
    refetchInterval: 60_000, // 1 min (opcional)
  });
}
