import {APIGatewayEvent, Context, Handler} from 'aws-lambda'
import AWS, {AWSError} from 'aws-sdk'
import {processImage} from 'code/processImage'

const s3 = new AWS.S3()

const getKey = ({
  key,
  width,
  height,
  prefix = '',
}: {
  prefix
  key: string
  width: number
  height: number
}) => {
  return `${prefix}${key}/${width}x${height}`
}

export const resizePhoto: Handler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  try {
    const {pathParameters, queryStringParameters} = event

    const width = parseFloat(queryStringParameters.w)
    const height = parseFloat(queryStringParameters.h)
    const {key} = pathParameters

    const imageStream = s3
      .getObject({
        Bucket: process.env.BUCKET,
        Key: `original/${key}`,
      })
      .createReadStream()

    const uploadedKey = getKey({
      prefix: 'resized/',
      key,
      width,
      height,
    })

    if (await imageExists(uploadedKey)) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Image already exists at ${uploadedKey}`,
          input: event,
        }),
      }
    }

    const resizedImageStream = processImage({
      imageStream,
      width,
      height,
    })
    await s3
      .upload({
        Bucket: process.env.BUCKET,
        Key: uploadedKey,
        Body: resizedImageStream,
      })
      .promise()

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Image successfully uploaded as ${uploadedKey}`,
        input: event,
      }),
    }
  } catch (error) {
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
        message: error.message,
        input: event,
        stack: error.stack,
      }),
    }
  }
}

const imageExists = async (key: string) => {
  try {
    await s3
      .headObject({
        Bucket: process.env.BUCKET,
        Key: key,
      })
      .promise()
    return true
  } catch {
    return false
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
