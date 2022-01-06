import React, { useState, useEffect, useRef } from 'react'
import { noop } from '../utils'

export function progressTimerMap(p: number) {
  if (p < 50)
    return 10
  if (p < 80)
    return 5
  if (p < 90)
    return 2
  if (p < 96)
    return 1
  return 0
}

export function useInterval(callback: Function, delay: number) {
  let savedCallback = useRef<Function>(noop)

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current()
    }, delay)
    return () => clearInterval(id)
  }, [delay])
}

interface ProgressBarProps {
  loading: boolean
}

export default function ProgressBar(props: ProgressBarProps) {
  let { loading } = props
  let [progress, setProgress] = useState(0)

  useInterval(() => {
    setProgress(progress + progressTimerMap(progress))
  }, 1000)

  useEffect(() => {
    if (!loading) setProgress(100)
  }, [loading])

  return (
    <div className='ui-kit-table-progress' style={{ width: `${progress}%` }} />
  )
}
