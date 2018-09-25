import sharp, {SharpInstance, strategy} from 'sharp'
import {compose} from 'ramda'

type Fit = 'contain' | 'cover'

interface ResizeOptions {
  width: number
  height: number
  fit?: Fit
}

const resize = ({width, height}: {width: number; height: number}) => (
  sharp: SharpInstance
) => sharp.resize(width, height)

const crop = () => (sharp: SharpInstance) => sharp.crop(strategy.entropy)

const withoutEnlargement = () => (sharp: SharpInstance) =>
  sharp.withoutEnlargement()

const withFit = (fit: Fit) => (sharp: SharpInstance) => {
  switch (fit) {
    case 'contain':
      return sharp.max()

    case 'cover':
      return sharp.min()

    default:
      return sharp
  }
}

const withFormat = () => (sharp: SharpInstance) =>
  sharp.jpeg({progressive: true, quality: 70})

export const processImage = ({
  imageStream,
  width,
  height,
  fit = 'cover',
}: {
  imageStream: NodeJS.ReadableStream
} & ResizeOptions) => {
  const imagePipepline = compose(
    resize({width, height}),
    crop(),
    withoutEnlargement(),
    withFit(fit),
    withFormat()
  )(sharp())

  return imageStream.pipe(imagePipepline)
}
