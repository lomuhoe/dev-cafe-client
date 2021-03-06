import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';

import PostView from './PostView';
import CommentArea from '../comments/CommentArea';

const PostPage = (props) => {
  const { match } = props;
  const { postId } = match.params;

  return (
    <div className="PostPage">
      <PostView postId={postId}/>
      <CommentArea
        postId={postId}
      />
    </div>
  );
};

PostPage.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
};

export default PostPage;
