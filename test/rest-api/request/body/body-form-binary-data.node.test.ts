import fetch from 'node-fetch'
import * as FormDataPolyfill from 'form-data'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.post('http://test.example/save-image', (req, res, ctx) => {
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

  const blob = new Blob([unicodeString], { type: 'image/jpeg' })

  formData.append('Files', blob)

  const res = await fetch('http://test.example/save-image', {
    method: 'POST',
    headers: formData.getHeaders(),
    body: formData,
  })
  const json = await res.json()

  expect(res.status).toBe(200)
  expect(json).toEqual({
    values: [255, 216, 255, 224, 0, 16, 74, 70, 73, 70],
  })
})
