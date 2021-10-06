import { ValuesOfCorrectTypeRule } from 'graphql'
import { setupWorker, rest } from 'msw'

const worker = setupWorker(
  rest.post('/saveimage', async (req, res, ctx) => {
    console.log('In request handler')
    const file = (req.body as any).Files
    const blob = file as Blob

    const receivedBuffer = await blob.text() //arrayBuffer()
    //const values = new Uint8Array(receivedBuffer)

    //const decodedData = decodeURIComponent(escape(receivedBuffer))
    const encoded = Uint8Array.from(
      [...receivedBuffer].map((ch) => ch.charCodeAt(0)),
    )

    return res(ctx.json({ values: [...encoded] }))
  }),
)

worker.start()
