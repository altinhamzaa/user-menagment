import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

interface Company {
  name?: string;
}

interface Address {
  street?: string;
  suite?: string;
  city?: string;
  zipcode?: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  company?: Company | string;
  address?: Address;
}

interface UsersPageProps {
  loading: boolean;
  users: User[];
}

const getCompany = (u: User): string =>
  (typeof u.company === "object" && u.company?.name) ||
  (typeof u.company === "string" ? u.company : "") ||
  "";

function UsersPage({ loading, users }: UsersPageProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "name" | "email" | "company">("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = users.slice();

    if (q) {
      arr = arr.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }

    arr.sort((a, b) => {
      let va: string = "";
      let vb: string = "";

      if (sortBy === "company") {
        va = getCompany(a).toLowerCase();
        vb = getCompany(b).toLowerCase();
      } else {
        va = (a[sortBy] || "").toString().toLowerCase();
        vb = (b[sortBy] || "").toString().toLowerCase();
      }

      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return arr;
  }, [users, query, sortBy, sortDir]);

  return (
    <div className="page users-page">
      <div className="controls">
        <input
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search"
        />
        <div className="sorting">
          <label>Sort:</label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "id" | "name" | "email" | "company")
            }
          >
            <option value="id">Default</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="company">Company</option>
          </select>
          <button
            onClick={() =>
              setSortDir((d) => (d === "asc" ? "desc" : "asc"))
            }
            className="sort-dir"
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <div className="users-list">
            {filtered.length === 0 ? (
              <div className="empty">No users found</div>
            ) : (
              filtered.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-card-left">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                    <div className="user-company">{getCompany(user)}</div>
                  </div>
                  <div className="user-card-right">
                    <Link to={`/user/${user.id}`} className="btn details">
                      Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UsersPage;
