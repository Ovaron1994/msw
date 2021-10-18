import { ValuesOfCorrectTypeRule } from 'graphql'
import { setupWorker, rest } from 'msw'

const worker = setupWorker(
  rest.post('/saveimage', async (req, res, ctx) => {
    console.log('In request handler')
    const file = (req.body as any).Files
    const blob = file as Blob

    const receivedBuffer = await blob.arrayBuffer()
    const values = new Uint8Array(receivedBuffer)

    return res(ctx.json({ values: [...values] }))
  }),
)

worker.start()