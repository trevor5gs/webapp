# Src

1. [Actions](/docs/src/Actions.md)
* [Components](/docs/src/Components.md)
* [Constants](/docs/src/Constants.md)
* [Containers](/docs/src/Containers.md)
* [Middleware](/docs/src/Middleware.md)
* [Networking](/docs/src/Networking.md)
* [Reducers](/docs/src/Reducers.md)
* [Routes](/docs/src/Routes.md)
* [Vendor](/docs/src/Vendor.md)

## Types of Views and Components
We're still refining and evolving how this is defined in the codebase, but it
seems like we are headed in the following direction.


### Containers
Connected to state object(s) within a store and associated with a route.
Container instances host connected, stateful and stateless components. They
may define the layouts and relationships of their components.

Examples: [Search](/src/containers/search), [Details](/src/containers/details)


### Connected components
Connected to state object(s) within a store, instances may host stateful and
stateless components. They typically dispatch actions out to the store and they
pass state changes onto their components. Smart components rarely define layouts
(_We are currently breaking this rule_).

Examples: [StreamComponent](/src/components/streams/StreamComponent.js),
[RegistrationForm](/src/components/forms/RegistrationForm.js)


### Stateful components
Instances tied into the [React lifecycle methods][react_lifecycle]. These
components host stateless and other stateful components. They define which
renderable methods are called or which components to render and when.

Examples: [ImageRegion](/src/components/posts/regions/ImageRegion.js),
[RelationshipButton](/src/components/relationships/RelationshipButton.js)


### Stateless components
[Are pure functions of their properties][react_stateless]. They are the building
blocks of the UI and deal with only how they are rendered. Stateless components
follow a faster code path in React core and are the preferred pattern.

Examples: [FormButton](/src/components/forms/FormButton.js),
[NavbarIcons](/src/components/navbar/NavbarIcons.js)

_Note: To separate the concerns more, we should break down the components
directory based on the connected, stateful and stateless categories._


### References
The following articles are shaping the thinking behind some of these patterns:

* [Dan Abramov: Smart and dumb components][medium_smart_and_dumb]
* [Dan Abramov: How to use classes and sleep at night][medium_night_classes]
* [Josh Black: Stateless components in React 0.14][medium_stateless]
* [React: Stateless docs][react_stateless] 


<!-- Markdown links -->
[react_lifecycle]: http://facebook.github.io/react/docs/component-specs.html#lifecycle-methods
[react_stateless]: http://facebook.github.io/react/docs/reusable-components.html#stateless-functions
[medium_night_classes]: https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4#.h198myqtj
[medium_smart_and_dumb]: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.x4x1hmyd6
[medium_stateless]: https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d#.dp5mulm56

