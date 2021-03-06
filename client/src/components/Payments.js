// stripe billing
import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
// connect react component to redux createStore
import { connect } from 'react-redux'
import * as actions from '../actions'

// getHandletoken call
class Payments extends Component {
    render() {
        return (
            <StripeCheckout
                name="Emaily"
                description="$5 for 5 survey credits"
                amount={500}
                token={token => this.props.handleToken(token)}
                stripeKey={process.env.REACT_APP_STRIPE_KEY}
            >
                <button className="btn">
                    Add Credits
                </button>
            </StripeCheckout>


        )
    }
}

// no map state function
// passes state and action creater into the Payments component, 
// without subscribing to the store
export default connect(null, actions)(Payments)