import index from '~/lib/vector/index.server'
import embeddings from '~/lib/openai/embedding.server'
import { UpstashVectorStore } from '@langchain/community/vectorstores/upstash'

// Instantiate the Upstash Vector Store that'll create and save embeddings
export default new UpstashVectorStore(embeddings, { index })
