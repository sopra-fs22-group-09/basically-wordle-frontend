import React, { Component } from 'react';

type MyProps = {
    // using `interface` is also ok
    message: 'hi' | 'bye';
};

type MyState = {
    count: number; // like this
};

class Button extends Component<MyProps, MyState> {
  state: MyState = {
    // optional second annotation for better type inference
    count: 0,
  };
  render() {
    return (
      <div>
        {this.props.message} {this.state.count}
      </div>
    );
  }
}

export default Button;