import { useState } from "react";
import { useInviteEmployeeMutation } from "../emplyeeApi";

export default function InviteEmployeePage() {

  const [email, setEmail] = useState("");
  const [inviteEmployee, { isLoading }] = useInviteEmployeeMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await inviteEmployee({ email }).unwrap();
      alert("Invitation sent!");
      setEmail("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h2>Invite Employee</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Employee email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          Invite
        </button>

      </form>

    </div>
  );
}