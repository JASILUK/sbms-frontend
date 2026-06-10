import { useState,useEffect } from "react"

import {useCreateRoleMutation, useUpdateRoleMutation,useGetPermissionsQuery } from "../rolesApi"



export default function RoleFormModal({ editing, close }) {

  const [name, setName] = useState("")
  const [selectedPerms, setSelectedPerms] = useState([])

  const { data } = useGetPermissionsQuery()

  const permissions = data?.data || []

  const [createRole] = useCreateRoleMutation()
  const [updateRole] = useUpdateRoleMutation()


  useEffect(() => {

    if (editing) {

      setName(editing.name)

      setSelectedPerms(
        editing.permissions?.map(p => p.id) || []
      )

    }

  }, [editing])


  const togglePermission = (id) => {

    if (selectedPerms.includes(id)) {

      setSelectedPerms(
        selectedPerms.filter(x => x !== id)
      )

    } else {

      setSelectedPerms(
        [...selectedPerms, id]
      )

    }

  }


  const submit = async (e) => {

    e.preventDefault()

    const payload = {
      name,
      permission_ids: selectedPerms
    }

    if (editing) {

      await updateRole({
        id: editing.id,
        data: payload
      })

    } else {

      await createRole(payload)

    }

    close()
  }


  return (

    <div className="modal">

      <h3>
        {editing ? "Edit Role" : "Create Role"}
      </h3>

      <form onSubmit={submit}>

        <input
          value={name}
          placeholder="Role name"
          onChange={(e) => setName(e.target.value)}
        />

        <h4>Permissions</h4>

        {permissions.map(p => (

          <div key={p.id}>

            <label>

              <input
                type="checkbox"
                checked={selectedPerms.includes(p.id)}
                onChange={() => togglePermission(p.id)}
              />

              {p.name}

            </label>

          </div>

        ))}

        <br />

        <button type="submit">
          Save
        </button>

        <button type="button" onClick={close}>
          Cancel
        </button>

      </form>

    </div>

  )

}