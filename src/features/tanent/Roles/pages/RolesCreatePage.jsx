import { useState } from "react";
import { useCreateRoleMutation, useGetPermissionsQuery} from "../rolesApi"

export default function RoleCreatePage(){

  const [name,setName] = useState("");
  const [selectedPerms,setSelectedPerms] = useState([]);

  const {data:permissions} = useGetPermissionsQuery();
  const [createRole] = useCreateRoleMutation();

  const submit = async(e)=>{
    e.preventDefault()

    await createRole({
      name,
      permissions:selectedPerms
    })
  }

  return(

    <div>

      <h2>Create Role</h2>

      <form onSubmit={submit}>

        <input
          value={name}
          placeholder="Role name"
          onChange={(e)=>setName(e.target.value)}
        />

        <h4>Permissions</h4>

        {permissions?.data?.map(p=>(
          <div key={p.id}>

            <label>

              <input
                type="checkbox"
                value={p.id}
                onChange={(e)=>{

                  if(e.target.checked){
                    setSelectedPerms([...selectedPerms,p.id])
                  }else{
                    setSelectedPerms(selectedPerms.filter(x=>x!==p.id))
                  }

                }}
              />

              {p.name}

            </label>

          </div>
        ))}

        <button type="submit">Create</button>

      </form>

    </div>

  )

}