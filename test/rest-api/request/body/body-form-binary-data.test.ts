import * as path from 'path'
import { pageWith } from 'page-with'

test('handles binary FormData in a request body', async () => {
  const { page, makeUrl } = await pageWith({
    example: path.resolve(__dirname, 'body-form-binary-data.mock.ts'),
    markup: path.resolve(__dirname, 'body-form-binary-data.page.html'),
  })

  await page.click('button')

  const res = await page.waitForResponse(makeUrl('/saveimage'))
  const status = res.status()

  const reqRes = await res.json()

  console.log(reqRes)
  const body = reqRes as { values: number[] }

  const byteArray = new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70]) // 10 first bytes of the jpeg

  expect(status).toBe(200)
  expect(body.values).toEqual([...byteArray])
})
