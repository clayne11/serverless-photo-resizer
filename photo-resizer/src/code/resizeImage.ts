import gmBase from 'gm'

const gm = gmBase.subClass({imageMagick: true})

export const resizeImage = ({
  imageStream,
  width,
  height,
}: {
  imageStream: NodeJS.ReadableStream
  width: number
  height: number
}) => {
  return gm(imageStream).resize(width, height, '>')
}

// function gmCreator(asset, bucket, resize_options) {
//   // function to create a GM process
//   return new Promise((resolve, reject) => {
//     try {
//       const func = gm(
//         s3.getObject({Bucket: bucket, Key: asset}).createReadStream()
//       )
//       func.options({timeout: resize_options.timeout || DEFAULT_TIME_OUT})
//       if (resize_options.quality) func.quality(resize_options.quality)
//       if (resize_options.resize && resize_options.crop)
//         func.resize(
//           resize_options.resize.width,
//           resize_options.resize.height,
//           '^'
//         )
//       else if (resize_options.resize)
//         func.resize(resize_options.resize.width, resize_options.resize.height)
//       if (resize_options.filter) func.filter(resize_options.filter)
//       if (resize_options.strip) func.strip()
//       if (resize_options.gravity) func.gravity(resize_options.gravity)
//       if (resize_options.crop)
//         func.crop(resize_options.crop.width, resize_options.crop.height, 0, 0)
//       if (resize_options.max) func.resize(resize_options.max)
//       if (resize_options.compress) func.compress(resize_options.compress)
//       if (resize_options.blur) {
//         func.blur(resize_options.blur[0], resize_options.blur[1])
//       }
//       return resolve(func)
//     } catch (err) {
//       return reject({statusCode: 500, body: `{"message":"${err.message}"}`})
//     }
//   })
// }

// params
// auto=enhance,compress
// dpr=2
// crop=edges
// fit=crop
// w=730
// h=486.6666666666667
