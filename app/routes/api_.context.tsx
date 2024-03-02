import { Document } from 'langchain/document'
import { ActionFunctionArgs } from '@remix-run/node'
import vectorServer from '~/lib/vector/store.server'
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio'

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  // Check if any article link are present in the form submission
  const articlesToEmbed = formData.get('articles') as string
  if (articlesToEmbed) {
    // Create the documents to be added to the Upstash Vector Store
    const documents: any[] = []
    await Promise.all(
      articlesToEmbed.split(',').map(async (link) => {
        // Use the link to render in the search results
        // Parse the link using Cheerio
        const loader = new CheerioWebBaseLoader(link.trim())
        const scraper = await loader.scrape()
        // Get the content of title tag to render in the search results
        const name = scraper('title').html()
        // Get the page content as string
        const pageContent = scraper.text()
        // Create metadata object to be inserted in the vector store
        const metadata = { link, name }
        documents.push(new Document({ pageContent, metadata }))
      }),
    )
    // Creating embeddings from the provided documents along with metadata
    // and add them to Upstash database
    await vectorServer.addDocuments(documents.filter(Boolean))
  }
}
