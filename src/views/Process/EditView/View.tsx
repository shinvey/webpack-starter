import React from 'react'
import { useParams } from 'react-router-dom'

export default function View () {
  const params = useParams<{ id: string }>()
  return <>
    <div>This is 编辑申请单{params.id}</div>
  </>
}
