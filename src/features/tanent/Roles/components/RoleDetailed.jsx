export default function RoleDetailModal({ role, close }) {

  if (!role) return null

  return (

    <div className="modal">

      <h3>{role.name}</h3>

      <p>
        System Role: {role.is_system_role ? "Yes" : "No"}
      </p>

      <h4>Permissions</h4>

      <ul>

        {role.permissions?.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}

      </ul>

      <button onClick={close}>
        Close
      </button>

    </div>

  )

}