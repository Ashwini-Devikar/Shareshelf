import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { Loading, ErrorMsg } from "../components/Status";
import { useUI } from "../context/UIContext";
import { api } from "../api/client";
import { shortDate } from "../utils/bookColor";

const successText = {
  approve: "Request approved. The due date is in 14 days.",
  reject: "Request rejected",
  return: "Book marked as returned",
};

export default function ReceivedRequests() {
  const { toast, confirm } = useUI();
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
  const act = async (request, action) => {
    if (action === "reject") {
      const ok = await confirm({
        title: "Reject this request?",
        message: `${request.borrower} will not be able to borrow "${request.bookTitle}" right now.`,
        confirmText: "Reject",
        danger: true,
      });
      if (!ok) return;
    }

    try {
      const updated = await api(`/api/requests/${request.id}/${action}`, { method: "PUT" });
      setRequests((prev) => prev.map((r) => (r.id === request.id ? updated : r)));
      toast(successText[action], action === "reject" ? "info" : "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-3">Received Requests</h2>
      <ErrorMsg message={error} />

      {loading ? (
        <Loading />
      ) : requests.length === 0 ? (
        <div className="text-center text-muted py-5">
          <div className="display-4">📥</div>
          Nobody has requested your books yet.
        </div>
      ) : (
        <div className="table-responsive bg-body rounded-3 shadow-sm border">
          <table className="table align-middle mb-0">
            <thead>
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
                        <button className="btn btn-sm btn-success me-1" onClick={() => act(r, "approve")}>
                          Approve
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => act(r, "reject")}>
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === "APPROVED" && (
                      <button className="btn btn-sm btn-outline-brand" onClick={() => act(r, "return")}>
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
