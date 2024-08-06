import React, { useId, useState } from 'react'
import LableComponent from './LableComponent'
import { Button } from 'antd'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { useDispatch } from 'react-redux'
import { setUser } from '../GlobalRedux/Features/auth/authSlice'
import { useRouter } from 'next/navigation'

type Props = {}
const Login = (props: Props) => {
  const router=useRouter()
  const dispatch=useDispatch()
  const [data,setData]=useState({
    email:"",
    password:""
  })
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className=' bg-[#B7C9F2] rounded-2xl p-4'>
      <h2 className="text-3xl font-bold py-6 text-center">Login</h2>
             
             <LableComponent handleChange={(e)=>{
        setData({...data,email:e.target.value})
      }} title='Email' placeholder='Email here' type='email' ></LableComponent>
            <LableComponent handleChange={
              (e)=>{
        setData({...data,password:e.target.value})
      }} title='Password' placeholder='*******' type='password' ></LableComponent>
     <div className="flex justify-center py-6 px-1">
     <button 
     onClick={async ()=>{
      const res=await signInWithEmailAndPassword(auth,data.email,data.password)
      const user=res.user;
      dispatch(setUser({
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
      }));
        router.push("/dashboard")   
    }}
     className="w-full text-lg bg-gray-200 border-2 border-gray-200 hover:bg-teal-500 text-black font-bold rounded-3xl focus:outline-teal focus:shadow-outline shadow-lg">
           Login
         </button>
         </div>
      </div>
    </div>
  )
}

export default Login