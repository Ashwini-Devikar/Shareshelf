export function Loading({ text = "Loading..." }) {
  return (
    <div className="text-center text-muted py-5">
      <div className="spinner-border spinner-border-sm me-2" role="status" />
      {text}
    </div>
  );
}

export function ErrorMsg({ message }) {
  if (!message) return null;
  return <div className="alert alert-danger py-2">{message}</div>;
}
