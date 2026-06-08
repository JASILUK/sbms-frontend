import { useNavigate } from "react-router-dom";
import { useSession } from "../../auth/useSession";

export default function SelectCompanyPage() {

  const navigate = useNavigate();
  const { session } = useSession();

  const companies = session?.companies || [];

  const selectCompany = (companyId) => {

    localStorage.setItem("activeCompanyId", companyId);

    navigate("/app/dashboard");

  };

  return (
    <div style={{ padding: 40 }}>

      <h1>Select Company</h1>

      {companies.map((company) => (
        <div
          key={company.id}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginBottom: 10,
            cursor: "pointer"
          }}
          onClick={() => selectCompany(company.id)}
        >
          <h3>{company.name}</h3>
        </div>
      ))}

    </div>
  );
}