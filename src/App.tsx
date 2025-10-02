import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import UsersPage from "./pages/UsersPage";
import UserDetails from "./pages/UserDetails";
import NewUser from "./pages/NewUser";

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo?: {
    lat: string;
    lng: string;
  };
}

export interface Company {
  name: string;
  catchPhrase?: string;
  bs?: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: Address;
  company?: Company;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (e) {
        console.error("Failed to fetch users", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const addLocalUser = (newUser: Omit<User, "id">) => {
    const id = Date.now();
    setUsers((prev) => [{ id, ...newUser }, ...prev]);
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="brand">User Management</Link>
        <nav>
          <Link to="/" className="nav-link">Users</Link>
          <Link to="/new" className="nav-link">Add User</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<UsersPage loading={loading} users={users} />} />
          <Route
            path="/user/:id"
            element={<UserDetails users={users} onDelete={deleteUser} onUpdate={updateUser} />}
          />
          <Route path="/new" element={<NewUser onAdd={addLocalUser} />} />
          <Route
            path="*"
            element={<div style={{ padding: 20 }}>Not Found — <Link to="/">Go Home</Link></div>}
          />
        </Routes>
      </main>

      <footer className="app-footer">
        Built for interview — data from jsonplaceholder.typicode.com
      </footer>
    </div>
  );
}

export default App;
