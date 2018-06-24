import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
// import LeftArrow from './LeftArrow'

const BackButton = ({ store, history }) => (
  <div onClick={() => history.push(store.ui.prevLocation)}>
    <LeftArrow />
  </div>
)

// TODO replace with an arrow icon
const LeftArrow = () => (
  <p>BACK</p>
)

export default withRouter(inject('store')(observer(BackButton)))

// Syntax Reference re inject
// const inject = (context) => (component) =>

// function inject(storeName) {

//   return function(component) {
//     return <React.context><component store={context.store} /></React.context>
//   }
// }
// props = {
//   store: {
//     ui: {

//     }
//   }
// }

// const { store } = props

// const { store: { ui } } = props
// const { ui } = props.store
