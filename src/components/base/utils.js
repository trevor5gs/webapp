export function mergeClassNames(props, defaultClassNames) {
  const { className } = props
  return className ? `${defaultClassNames} ${className}` : defaultClassNames
}

