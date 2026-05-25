import type { Reservation } from '../../services/types';

type Status = Reservation['status'];

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  RESERVED:  { label: 'RESERVED',  color: '#f59e0b' },
  CONFIRMED: { label: 'CONFIRMED', color: '#3b82f6' },
  RELEASED:  { label: 'RELEASED',  color: '#6b7280' },
  EXPIRED:   { label: 'EXPIRED',   color: '#ef4444' },
};

interface StatusBadgeProps {
  status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, color: '#6b7280' };
  return (
    <span
      className="status-badge"
      style={{ backgroundColor: config.color }}
    >
      {config.label}
    </span>
  );
}
