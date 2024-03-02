import clsx from 'clsx'
import ReactMarkdown from 'react-markdown'

interface MarkdownProps {
  index: number
  message: string
}

const Markdown = ({ message, index }: MarkdownProps) => {
  return (
    <ReactMarkdown
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>
        },
      }}
      className={clsx('w-full mt-4 pt-4 prose break-words prose-p:leading-relaxed prose-pre:p-0', index !== 0 && 'border-t')}
    >
      {message}
    </ReactMarkdown>
  )
}

export default Markdown
