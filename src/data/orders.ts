/**
 * Order presentation helpers. Order data itself comes from the RKB API.
 * Backend statuses: pending | confirmed | processing | completed | cancelled | refunded
 */

export const orderStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    pending: { label: 'Pending', color: '#D97706', bgColor: '#FEF3C7' },
    confirmed: { label: 'Confirmed', color: '#2563EB', bgColor: '#DBEAFE' },
    processing: { label: 'Processing', color: '#7C3AED', bgColor: '#EDE9FE' },
    completed: { label: 'Completed', color: '#16A34A', bgColor: '#DCFCE7' },
    cancelled: { label: 'Cancelled', color: '#DC2626', bgColor: '#FEE2E2' },
    refunded: { label: 'Refunded', color: '#6B7280', bgColor: '#F3F4F6' },
};

export const getStatusConfig = (status: string) =>
    orderStatusConfig[status] ?? { label: status, color: '#6B7280', bgColor: '#F3F4F6' };

export const formatOrderDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const formatINR = (amount: number): string =>
    `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
