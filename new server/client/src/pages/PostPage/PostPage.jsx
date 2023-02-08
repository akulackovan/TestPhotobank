import React, { useState, useEffect, Component } from "react";
import PostPageComponet from "../../components/PostPage/PostPageComponent";

export default class PostPage extends Component {
  render() {
    return (
      <div className="postPage">
        <PostPageComponet id={this.props.match.params.id} />
      </div>
    );
  }
}
