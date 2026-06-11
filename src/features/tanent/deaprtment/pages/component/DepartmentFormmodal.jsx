import { useState,useEffect } from "react";

import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetDepartmentsQuery
} from "../../departmentApi";

export default function DepartmentFormModal({editing,close}){

  const [name,setName] = useState("");
  const [parent,setParent] = useState("");

  const {data} = useGetDepartmentsQuery();
  const departments = data?.data

  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();

  useEffect(()=>{

    if(editing){
      setName(editing.name);
      setParent(editing.parent || "");
    }

  },[editing]);

  const submit = async (e)=>{

    e.preventDefault();

    const payload = {
      name,
      parent_id: parent || null
    };

    if(editing){

      await updateDepartment({
        id:editing.id,
        data:payload
      });

    }else{

      await createDepartment(payload);

    }

    close();

  };

  return(

    <div>

      <h3>{editing ? "Edit Department":"Create Department"}</h3>

      <form onSubmit={submit}>

        <input
          value={name}
          placeholder="Department name"
          onChange={(e)=>setName(e.target.value)}
        />

        <select
          value={parent}
          onChange={(e)=>setParent(e.target.value)}
        >

          <option value="">
            No Parent
          </option>

          {departments?.map(dep=>(
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}

        </select>

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