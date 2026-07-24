import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }) {
  const map = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    published: { variant: 'success', label: 'Published' },
    draft: { variant: 'warning', label: 'Draft' },
  };
  const { variant, label } = map[status] || { variant: 'secondary', label: status };
  return <Badge variant={variant}>{label}</Badge>;
}
