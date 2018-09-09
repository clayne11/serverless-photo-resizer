import {APIGatewayEvent, Callback, Context, Handler} from 'aws-lambda'
import AWS from 'aws-sdk'

// params
// auto=enhance,compress
// dpr=2
// crop=edges
// fit=crop
// w=730
// h=486.6666666666667

export const hello: Handler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  try {
    console.log('--- process.env ---', process.env)
    const {pathParameters, queryStringParameters} = event

    const width = parseFloat(queryStringParameters.w)
    const height = parseFloat(queryStringParameters.h)
    const {key} = pathParameters

    const s3 = new AWS.S3()
    const image = await s3
      .getObject({
        Bucket: process.env.bucket,
        Key: key,
      })
      .promise()

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message:
          'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
        input: event,
      }),
    }

    return response
  } catch (error) {
    console.log('--- error ---', error)
  }
}

const parseFloat = (numString: string) => {
  if (!numString) {
    return undefined
  }

  const num = Number.parseFloat(numString)
  return Number.isNaN(num) ? undefined : num
}
