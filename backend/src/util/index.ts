export function isError(o): o is Error {
  return (
    o instanceof Error ||
    (typeof o.stack === 'string' && typeof o.message === 'string')
  )
}
