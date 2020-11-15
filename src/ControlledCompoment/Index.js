import React, { useState, useEffect } from 'react';

// 无状态组件
function notState(props) {
  return (
    <div style={{ color: "red" }}>{props}，我是无状态组件</div>
  )
}





class Index extends React.Component {
  state = {
    childText: "我是从父组件传过来的文本",
  }
  componentDidMount() {
    // function Person() {

    // }

    // var person = new Person();

    // console.log(Person.prototype.constructor);
    // console.log(Person.__proto__);

    function test() {
      console.log(1)
      setTimeout(function () {
        console.log(2);
      }, 1000)
    }
    test();
    setTimeout(function () {
      console.log(3);
    }, 1000)

    new Promise(function (resolve) {
      console.log(4);
      setTimeout(function () {
        console.log(5);
      }, 100)
      resolve()
    }).then(function () {
      setTimeout(function () {
        console.log(6);
      }, 0)
      console.log(7);
    })
    console.log(8);
  }
  deepClone() {






  }

  render() {
    const { childText } = this.state;
    return (
      <div>
        {notState(childText)}
      </div>
    )
  }

}



export default Index;