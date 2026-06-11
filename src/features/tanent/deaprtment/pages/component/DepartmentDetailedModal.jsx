import { useGetDepartmentDetailQuery } from "../../departmentApi";


export default function DepartmentDetailModal({ id, close }) {

  const { data, isLoading } = useGetDepartmentDetailQuery(id);

  if (isLoading) return <div>Loading...</div>;

  const dep = data?.data; // 👈 extract real data

  if (!dep) return null;

  return (

    <div>

      <h3>{dep.name}</h3>

      <p>Members: {dep.member_count}</p>

      <h4>Breadcrumb</h4>

      <ul>
        {dep.path?.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>

      <h4>Children</h4>

      <ul>
        {dep.children?.map(child => (
          <li key={child.id}>{child.name}</li>
        ))}
      </ul>

      <button onClick={close}>
        Close
      </button>

    </div>

  );
}