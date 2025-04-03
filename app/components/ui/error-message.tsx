import React from 'react'

type Props = {error:string|null|undefined}

export default function ErrorMessage({error}: Props) {
  return error ? (
   <span className='text-[13px] text-red-500'>{error}</span>
  ):null
}