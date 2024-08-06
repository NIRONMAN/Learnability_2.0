
import React from 'react'

type Props = {
    title:string,
    placeholder:string,
    type:string,
    handleChange:any
}

const LableComponent = ({title,placeholder,type,handleChange}: Props) => {
  return (
<div className="mb-4">
        <label className="block text-white text-sm font-bold mb-2" >
            {title}
        </label>
        <input onChange={(e)=>handleChange(e)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="fullName" type={type} placeholder={placeholder} />
      </div>  )
}

export default LableComponent