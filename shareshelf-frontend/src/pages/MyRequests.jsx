import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { Loading, ErrorMsg } from "../components/Status";
import { useUI } from "../context/UIContext";
import { api } from "../api/client";
import { shortDate } from "../utils/bookColor";

export default function MyRequests() {
  const { toast, confirm } = useUI();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/requests/sent")
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (request) => {
    const ok = await confirm({
      title: "Cancel this request?",
      message: `Your request for "${request.bookTitle}" will be cancelled.`,
      confirmText: "Cancel request",
      danger: true,
    });
    if (!ok) return;

    try {
      const updated = await api(`/api/requests/${request.id}/cancel`, { method: "PUT" });
      setRequests((prev) => prev.map((r) => (r.id === request.id ? updated : r)));
      toast("Request cancelled", "info");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-3">My Requests</h2>
      <ErrorMsg message={error} />

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <div className="text-center text-muted py-5">
          <div className="display-4">📤</div>
          You haven't requested any books yet. <Link to="/browse">Browse books</Link>.
        </div>
      ) : (
        <div className="table-responsive bg-body rounded-3 shadow-sm border">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>Book</th>
                <th>Owner</th>
                <th>Requested</th>
                <th>Due date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="fw-semibold">{r.bookTitle}</td>
                  <td>{r.owner}</td>
                  <td>{shortDate(r.requestedAt)}</td>
                  <td>{shortDate(r.dueDate)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="text-end">
                    {r.status === "PENDING" && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(r)}>
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
