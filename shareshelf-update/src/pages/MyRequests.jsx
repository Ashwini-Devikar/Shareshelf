import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { sentRequests } from "../data/mockUser";

export default function MyRequests() {
  const [requests, setRequests] = useState(sentRequests);

  const cancel = (id) => {
    // Week 3: PUT /api/requests/{id}/cancel
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "CANCELLED" } : r)));
  };

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-3">My Requests</h2>
      <div className="table-responsive bg-white rounded-3 shadow-sm">
        <table className="table align-middle mb-0">
          <thead className="table-light">
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
                <td>{r.requestedAt}</td>
                <td>{r.dueDate || "—"}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="text-end">
                  {r.status === "PENDING" && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => cancel(r.id)}>
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
