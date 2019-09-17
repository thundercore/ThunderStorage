import { INestApplication } from '@nestjs/common'
import { SwaggerDocument } from '@nestjs/swagger'

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Thunder Store</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700" rel="stylesheet">
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url='/docs/json'></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"> </script>
  </body>
</html>
`

export function setupDocumentation(
  path: string,
  app: INestApplication,
  document: SwaggerDocument
) {
  const httpAdapter = app.getHttpAdapter()
  const validatePath = (inputPath: string): string =>
    inputPath.charAt(0) !== '/' ? '/' + inputPath : inputPath

  const finalPath = validatePath(path)

  httpAdapter.get(finalPath + '/json', (req, res) => res.json(document))
  httpAdapter.get(finalPath, (req, res) => res.send(html))
}
