export const token = process.env.AUTH_TOKEN
export const password = process.env.AUTH_PASSWORD

export async function authMiddleware(request: Request, cb: any): Promise<Response> {
  const auth = request.headers.get('authorization')

  // Disable auth for local development
  if (request.headers.get('host')?.includes('localhost')) {
    return cb()
  }

  return new Promise(async (resolve) => {
    if (auth !== token) {
      resolve(
        new Response('Unauthorized', {
          status: 401,
        })
      )
    }

    resolve(cb())
  })
}
