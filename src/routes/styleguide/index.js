import StyleGuide from '../../components/devtools/StyleGuide'

export default [
  {
    path: 'styleguide',
    getComponents(location, cb) {
      cb(null, StyleGuide)
    },
  },
]

