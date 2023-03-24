import React, { Component } from "react";
import Search from "../../components/Search/Search";

export default class SearchPage extends Component {
  render() {
    return (
      <div className="searchPage"  data-testid="searchPage">
        <Search id={this.props.match.params.id} />
      </div>
    );
  }
}
