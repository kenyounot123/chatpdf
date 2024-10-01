export const formatDate = (timestamp: number | undefined) => {
  if (timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,  // This makes it 12-hour format. Set to `false` for 24-hour format.
    });
  }
  return '';
};