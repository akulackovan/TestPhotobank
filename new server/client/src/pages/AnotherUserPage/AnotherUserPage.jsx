import { Component } from "react";
import { AnotherPage } from "../../components/AnotherPage/AnotherPage";
import React from "react";

export default class AnotherUserPage extends Component {
  render() {
    return (
      <div className="anotherPage" data-testid="AnotherPage">
        <AnotherPage id={this.props.match.params.id} />
      </div>
    );
  }
}