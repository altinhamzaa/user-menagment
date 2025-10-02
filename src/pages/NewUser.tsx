import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../App";

interface NewUserProps {
  onAdd: (user: Omit<User, "id">) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}

interface Errors {
  name?: string;
  email?: string;
}

function NewUser({ onAdd }: NewUserProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    website: "",
    company: "",
    street: "",
    suite: "",
    city: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const newUser: Omit<User, "id"> = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      website: form.website,
      company: { name: form.company || "Local User" },
      address: {
        street: form.street,
        suite: form.suite,
        city: form.city,
        zipcode: form.zipcode,
      },
    };

    onAdd(newUser);
    navigate("/");
  };

  return (
    <div className="page new-page">
      <div className="form-card">
        <h2>Add New User (local only)</h2>
        <form onSubmit={handleSubmit} className="user-form">
          <label>
            Name *
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </label>

          <label>
            Email *
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </label>

          <label>
            Phone
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </label>

          <label>
            Website
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </label>

          <label>
            Company
            <input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </label>

          <fieldset className="address">
            <legend>Address</legend>
            <input
              placeholder="Street"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
            />
            <input
              placeholder="Suite"
              value={form.suite}
              onChange={(e) => setForm({ ...form, suite: e.target.value })}
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              placeholder="Zipcode"
              value={form.zipcode}
              onChange={(e) => setForm({ ...form, zipcode: e.target.value })}
            />
          </fieldset>

          <div className="form-actions">
            <button className="btn" type="submit">
              Add User
            </button>
            <button
              className="btn ghost"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewUser;
