import gmBase from 'gm'

const gm = gmBase.subClass({imageMagick: true})

interface ResizeOptions {
  width: number
  height: number
}

export const resizeImage = ({
  imageStream,
  width,
  height,
}: {
  imageStream: NodeJS.ReadableStream
} & ResizeOptions) => {
  return gm(imageStream)
    .resize(width, height, '>')
    .strip() // Removes any profiles or comments. Work with pure data
    .interlace('Line') // Line interlacing creates a progressive build up
    .quality(50)
    .stream('jpeg') // Quality is for you to decide
}

// params
// auto=enhance,compress
// dpr=2
// crop=edges
// fit=crop
// w=730
// h=486.6666666666667
