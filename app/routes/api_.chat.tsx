import vectorServer from '~/lib/vector/store.server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import type { ActionFunctionArgs } from '@remix-run/node'
import completionServer from '~/lib/openai/completion.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  // Set of messages between user and chatbot
  const { messages = [] } = await request.json()
  // Get the latest question stored in the last message of the chat array
  const searchQuery = messages[messages.length - 1].content
  // Perform Similarity Search using the Upstash Vector Store
  const queryResult = await vectorServer.similaritySearchWithScore(searchQuery, 3)
  // Filter the records with confidence score > 70% and
  // set the metadata as response to render search results
  const results = queryResult.filter((i) => i[1] >= 0.7).map((i) => i[0].metadata)
  // Now use OpenAI Text Completion with relevant articles as context
  const completionResponse = await completionServer.chat.completions.create({
    stream: true,
    model: 'gpt-3.5-turbo',
    messages: [
      {
        // create a system content message to be added as
        // the open ai text completion will supply it as the context with the API
        role: 'system',
        content: `Behave like a Google. You have the knowledge of the following articles:: ${JSON.stringify(results)}. Each response should be in 100% markdown compatible format and should have hyperlinks in it. Be precise. Do add some general text in the response related to the query.`,
      },
      // also, pass the whole conversation!
      ...messages,
    ],
  })
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(completionResponse)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
