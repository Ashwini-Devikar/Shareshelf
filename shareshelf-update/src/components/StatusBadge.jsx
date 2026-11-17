const styles = {
  AVAILABLE: "bg-success",
  REQUESTED: "bg-warning text-dark",
  BORROWED: "bg-secondary",
  PENDING: "bg-warning text-dark",
  APPROVED: "bg-success",
  REJECTED: "bg-danger",
  RETURNED: "bg-info text-dark",
  CANCELLED: "bg-secondary",
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${styles[status] || "bg-secondary"}`}>{status}</span>;
}
