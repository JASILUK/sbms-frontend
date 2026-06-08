import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../../auth/useSession";
import { useCreateCompanyMutation } from "../CompanyApi";

export default function WorkspacesPage() {

  const navigate = useNavigate();
  const { session } = useSession();
  const [createCompany] = useCreateCompanyMutation();

  const companies = session?.companies || [];

  const [name, setName] = useState("");

  const selectCompany = (id) => {

    localStorage.setItem("activeCompanyId", id);

    navigate("/app/dashboard");
  };

  const handleCreate = async () => {

    if (!name) return;

    try {

      const res = await createCompany({ name }).unwrap();

      localStorage.setItem("activeCompanyId", res.id);

      navigate("/app/dashboard");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 40 }}>

      <h1>Select Workspace</h1>

      {companies.length > 0 && (
        <div>
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => selectCompany(company.id)}
              style={{
                padding: 20,
                border: "1px solid #ddd",
                marginBottom: 10,
                cursor: "pointer"
              }}
            >
              {company.name}
            </div>
          ))}
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      <h2>Create Company</h2>

      <input
        placeholder="Company name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleCreate}>
        Create
      </button>

    </div>
  );
}