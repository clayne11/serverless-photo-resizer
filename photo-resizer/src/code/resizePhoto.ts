import {APIGatewayEvent, Context, Handler} from 'aws-lambda'
import AWS, {AWSError} from 'aws-sdk'
import {resizeImage} from 'code/resizeImage'

export const resizePhoto: Handler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  try {
    const {pathParameters, queryStringParameters} = event

    const width = parseFloat(queryStringParameters.w)
    const height = parseFloat(queryStringParameters.h)
    const {key} = pathParameters

    const s3 = new AWS.S3()

    const imageStream = s3
      .getObject({
        Bucket: process.env.BUCKET,
        Key: `original/${key}`,
      })
      .createReadStream()

    resizeImage({
      imageStream,
      width,
      height,
    })

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
    if (isAwsError(error)) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
          input: event,
        }),
      }
    }

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Something went wrong',
        input: event,
      }),
    }
  }
}

const parseFloat = (numString: string) => {
  if (!numString) {
    return undefined
  }

  const num = Number.parseFloat(numString)
  return Number.isNaN(num) ? undefined : num
}

const AWS_ERROR_KEYS = [
  'message',
  'code',
  'region',
  'time',
  'requestId',
  'extendedRequestId',
  'cfId',
  'statusCode',
]

const isAwsError = (error: any): error is AWSError => {
  const errorKeys = new Set(Object.keys(error))
  return AWS_ERROR_KEYS.every(key => errorKeys.has(key))
}
