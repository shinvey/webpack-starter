import React from 'react'
import { useParams } from 'react-router-dom'

export default function View () {
  const params = useParams<{ id: string }>()
  return <>
    <div>This is 申请单{params.id}详情</div>
  </>
}
