import React from 'react';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';

import withPostListItemContainer from '../../containers/PostListItemContainer';

import Category from '../categories/Category';
import User from '../users/User';

const renderCategory = category => (
  <>
    카테고리 :
    <Link to={`posts?categories=${category._id}`}>
      {category.name}
    </Link>
  </>
);

const renderUser = user => (
  <div>작성자 : {user.profileName}</div>
);

const PostListItem = (props) => {
  const { post } = props;
  return (
    <li name={post.title} key={post._id}>
      <p>
        제목 :
        <Link to={`posts/${post._id}`}>
          {post.title}<br/>
        </Link>
        <Category categoryId={post.category} renderCategory={renderCategory} />
        <User userId={post.author} renderUser={renderUser} />
        작성 시간 : {dateFormat(post.date, 'yy/mm/dd h:MM TT')}<br/>
      </p>
    </li>
  );
};

export default withPostListItemContainer(PostListItem);