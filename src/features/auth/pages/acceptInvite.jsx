import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { useEffect, useState } from "react"

import {
  useGetInviteDetailsMutation,
  useAcceptInviteMutation
} from "../authApi"

export default function AcceptInvitePage(){

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get("token")

  const [getInviteDetails] = useGetInviteDetailsMutation()
  const [acceptInvite] = useAcceptInviteMutation()

  const [invite,setInvite] = useState(null)

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")

  useEffect(()=>{

    async function loadInvite(){

      if(!token) return

      try{

        const res = await getInviteDetails(token).unwrap()

        setInvite(res.data || res)

      }catch(err){

        console.error("Invalid invite")

      }

    }

    loadInvite()

  },[token])


  const submit = async(e)=>{

    e.preventDefault()

    try{

      const payload = { token }

      if(invite.requires_registration){

        payload.username = username
        payload.password = password

      }

      await acceptInvite(payload).unwrap()

      navigate("/dashboard")

    }catch(err){

      alert("Failed to accept invitation")

    }

  }


  if(!invite) return <div>Loading invitation...</div>


  return(

    <div>

      <h2>Accept Invitation</h2>

      <p>Email: {invite.email}</p>
      <p>Company: {invite.company}</p>
      <p>Invited By: {invite.invited_by}</p>

      <form onSubmit={submit}>

        {invite.requires_registration && (

          <>

            <input
              placeholder="Choose username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

          </>

        )}

        <button type="submit">

          {invite.requires_registration
            ? "Create Account & Join"
            : "Join Company"}

        </button>

      </form>

    </div>

  )

}