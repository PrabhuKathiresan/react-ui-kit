import React from 'react'
import { CodeBlock, atomOneDark } from 'react-code-blocks'

export default function AppCode({ code }) {
  return (
    <div className='code-block'>
      <CodeBlock
        text={code}
        language='jsx'
        showLineNumbers={false}
        wrapLines={false}
        theme={atomOneDark}
        codeBlock
      />
    </div>
  )
}
