import fetch from 'node-fetch'
import * as FormDataPolyfill from 'form-data'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.post('http://test.example/save-image', (req, res, ctx) => {
    const files = req.body as File

    console.log(files)

    // for (const it of buffer.values()) {
    //   console.log(it)
    //}

    return res(ctx.json(req.body))
  }),
)

beforeAll(() => {
  server.listen()
})

afterAll(() => {
  server.close()
})

test('handles requests with binary content', async () => {
  // Note that creating a `FormData` instance in Node/JSDOM differs
  // from the same instance in a real browser. Follow the instructions
  // of your `fetch` polyfill to learn more.
  const formData = new FormDataPolyfill()

  const buffer = new ArrayBuffer(10)
  const unicodeString = 'ÿØÿàJFIF' // unicode encoded start of jpeg image
  const byteArray = new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70]) // 10 first bytes of the jpeg

  // In Browser
  // const blob = new Blob([unicodeString], { type: 'image/jpeg' })

  // In node
  const nodeBuffer = Buffer.from(byteArray.buffer)
  console.log(nodeBuffer.byteLength)

  //formData.append('Files', nodeBuffer)
  formData.append('ABC', 'Test')
  formData.append('ABC1', 'Test1')
  formData.append('ABC2', 'Test2')
  formData.append('ABC3', nodeBuffer)

  const res = await fetch('http://test.example/save-image', {
    method: 'POST',
    headers: formData.getHeaders(),
    body: formData,
  })
  const json = await res.json()
  console.log(json)

  expect(res.status).toBe(200)
  expect(json).toEqual({
    values: [255, 216, 255, 224, 0, 16, 74, 70, 73, 70],
  })
})
