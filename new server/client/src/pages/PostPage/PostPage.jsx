import React, { Component } from "react";
import PostPageComponet from "../../components/PostPage/PostPageComponent";

export default class PostPage extends Component {
  render() {
    return (
      <div className="postPage" data-testid="postPage">
        <PostPageComponet id={this.props.match.params.id} />
      </div>
    );
  }
}
