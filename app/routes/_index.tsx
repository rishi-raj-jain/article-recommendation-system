import { useChat } from 'ai/react'
import { Form } from '@remix-run/react'
import Markdown from '~/components/markdown'
import { Input } from '~/components/ui/input'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()
  return (
    <div className="mt-8 gap-y-4 px-4 md:px-0 w-full flex flex-col items-center">
      <h1 className="w-[300px] md:w-[600px] text-xl font-semibold">Article Recommendation System</h1>
      <Form navigate={false} method="post" action="/api/context" className="border-t pt-8 mt-4 w-[300px] md:w-[600px] flex flex-col items-start">
        <textarea
          autoComplete="off"
          className="w-full border rounded p-2 outline-gray-400"
          name="articles"
          placeholder="Enter Article URLs to reference [seperated with comma (,)]"
        ></textarea>
        <button className="rounded mt-2 px-3 py-1 border text-black hover:border-black" type="submit">
          Add Articles &rarr;
        </button>
      </Form>
      <form onSubmit={handleSubmit} className="border-t pt-8 mt-4 w-[300px] md:w-[600px] flex flex-col">
        <Input
          id="message"
          value={input}
          type="message"
          autoComplete="off"
          onChange={handleInputChange}
          placeholder="Enter your query"
          className="border-black/25 hover:border-black placeholder:text-black/75 rounded"
        />
        <button className="rounded max-w-max mt-2 px-3 py-1 border text-black hover:border-black" type="submit">
          Search &rarr;
        </button>
      </form>
      <div className="w-[300px] md:w-[600px] flex flex-col">
        {messages.map((i, _) => (
          <Markdown message={i.content} index={_} />
        ))}
      </div>
      <div className="mt-8 w-full">&nbsp;</div>
    </div>
  )
}
