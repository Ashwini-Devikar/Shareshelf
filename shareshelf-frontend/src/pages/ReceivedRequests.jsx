import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { Loading, ErrorMsg } from "../components/Status";
import { api } from "../api/client";
import { shortDate } from "../utils/bookColor";

export default function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/requests/received")
      .then(setRequests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // action is "approve", "reject" or "return"
  const act = async (id, action) => {
    setError("");
    try {
      const updated = await api(`/api/requests/${id}/${action}`, { method: "PUT" });
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-3">Received Requests</h2>
      <ErrorMsg message={error} />

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <div className="text-center text-muted py-5">Nobody has requested your books yet.</div>
      ) : (
        <div className="table-responsive bg-white rounded-3 shadow-sm">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Book</th>
                <th>Borrower</th>
                <th>Message</th>
                <th>Due date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="fw-semibold">{r.bookTitle}</td>
                  <td>{r.borrower}</td>
                  <td className="text-muted small">{r.message || "—"}</td>
                  <td>{shortDate(r.dueDate)}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="text-end text-nowrap">
                    {r.status === "PENDING" && (
                      <>
                        <button className="btn btn-sm btn-success me-1" onClick={() => act(r.id, "approve")}>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => act(r.id, "reject")}>
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === "APPROVED" && (
                      <button className="btn btn-sm btn-outline-brand" onClick={() => act(r.id, "return")}>
                        Mark returned
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
