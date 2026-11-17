import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { receivedRequests } from "../data/mockUser";

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function ReceivedRequests() {
  const [requests, setRequests] = useState(receivedRequests);

  const update = (id, changes) =>
    setRequests(requests.map((r) => (r.id === id ? { ...r, ...changes } : r)));

  // Week 3: these call PUT /api/requests/{id}/approve | reject | return
  const approve = (id) => update(id, { status: "APPROVED", dueDate: addDays(14) });
  const reject = (id) => update(id, { status: "REJECTED" });
  const markReturned = (id) => update(id, { status: "RETURNED" });

  return (
    <div className="my-4">
      <h2 className="fw-bold mb-3">Received Requests</h2>
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
                <td>{r.dueDate || "—"}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="text-end text-nowrap">
                  {r.status === "PENDING" && (
                    <>
                      <button className="btn btn-sm btn-success me-1" onClick={() => approve(r.id)}>Approve</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => reject(r.id)}>Reject</button>
                    </>
                  )}
                  {r.status === "APPROVED" && (
                    <button className="btn btn-sm btn-outline-brand" onClick={() => markReturned(r.id)}>
                      Mark returned
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
