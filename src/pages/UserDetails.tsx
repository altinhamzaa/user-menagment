import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { User } from "../App";

interface UserDetailsProps {
  users: User[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<User>) => void;
}

function UserDetails({ users, onDelete }: UserDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <div style={{ padding: 20 }}>
        <h2>User ID missing</h2>
        <button onClick={() => navigate(-1)} className="btn">Back</button>
      </div>
    );
  }

  const userId: string | number = isNaN(Number(id)) ? id : Number(id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>User not found</h2>
        <button onClick={() => navigate(-1)} className="btn">Back</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (typeof user.id === "number" && window.confirm("Delete this user locally?")) {
      onDelete(user.id);
      navigate("/");
    }
  };

  const fullAddress = user.address
    ? `${user.address.street ?? ""} ${user.address.suite ?? ""}, ${user.address.city ?? ""} ${user.address.zipcode ?? ""}`
    : "";

  return (
    <div className="page details-page">
      <div className="details-card">
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Company:</strong> {user.company?.name ?? ""}</p>
        <p><strong>Phone:</strong> {user.phone ?? "—"}</p>
        <p><strong>Website:</strong> {user.website ?? "—"}</p>
        <p><strong>Address:</strong> {fullAddress}</p>

        <div className="details-actions">
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
          <button className="btn danger" onClick={handleDelete}>Delete (local)</button>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
