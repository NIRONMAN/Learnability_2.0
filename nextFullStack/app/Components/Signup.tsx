
import React, { useEffect, useState } from 'react'
import LableComponent from './LableComponent'
import { Button } from 'antd'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/utils/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../GlobalRedux/Features/auth/authSlice'

import { useRouter } from 'next/navigation'


const Signup = () => {
  const dispatch=useDispatch();
  const [data,setData]=useState({
    fullName:"",
    email:"",
    password:""
  })
  const router=useRouter()
  return (
    <div className="h-full w-full flex flex-col items-center justify-center ">
            <div className=' bg-[#B7C9F2] rounded-2xl p-3'>

      <h2 className="text-3xl font-bold text-center py-2 pb-5">Sign Up</h2>
   
      <LableComponent handleChange={(e)=>{
        setData({...data,fullName:e.target.value})
      }} title='Name' placeholder='Name here' type='text' ></LableComponent>
      <LableComponent handleChange={(e)=>{
                setData({...data,email:e.target.value})
      }} title='Email' placeholder='Email here' type='email' ></LableComponent>
      <LableComponent handleChange={(e)=>{
         setData({...data,password:e.target.value})

      }} title='Password' placeholder='*******' type='password' ></LableComponent>
      
      <div className=" flex justify-center py-3 p-2">
      <button className=" w-full text-lg bg-gray-200 hover:bg-gray-500 text-black font-bold  rounded-3xl focus:outline-teal focus:shadow-outline shadow-lg"
      onClick={async ()=>{
        const res=await createUserWithEmailAndPassword(auth,data.email,data.password)
        const user=res.user;
        await updateProfile(user,{displayName:data.fullName})
        dispatch(setUser({
          userId: user.uid,
          email: user.email,
          displayName: user.displayName,
        }));     
        router.push("/dashboard")   
       }}
      >
            Sign Up
          </button>
          </div>
          </div>

    </div>
  )
}

export default Signup