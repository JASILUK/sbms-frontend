import {
  useGetRolesQuery,
  useDeleteRoleMutation
} from "../rolesApi"


export default function RoleTable({ onEdit, onView }){

  const {data,isLoading} = useGetRolesQuery()
  const [deleteRole] = useDeleteRoleMutation()

  if(isLoading) return <div>Loading...</div>

  const roles = data?.data || []

  return(

    <table>

      <thead>
        <tr>
          <th>Name</th>
          <th>System</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>

        {roles.map(role => (

          <tr key={role.id}>

            <td>{role.name}</td>

            <td>
              {role.is_system_role ? "Yes" : "No"}
            </td>

            <td>

              {/* VIEW BUTTON */}
              <button onClick={()=>onView(role)}>
                View
              </button>

              {/* EDIT */}
              {!role.is_system_role && (
                <button onClick={()=>onEdit(role)}>
                  Edit
                </button>
              )}

              {/* DELETE */}
              {!role.is_system_role && (
                <button onClick={()=>deleteRole(role.id)}>
                  Delete
                </button>
              )}

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )

}