import React from 'react';
import axios from 'axios';

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      post: null,
      error: true,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.getPost(id);
  }

  getPost = (id) => {
    axios.get(`/api/v1/posts/${id}`)
      .then((result) => {
        if (result.status === 200) {
          this.setState({
            post: result.data.post,
            error: false,
          });
        }
      })
      .catch((err) => {
        this.setState({ error: true, post: null });
      });
  }


  render() {
    const { post, error } = this.state;
    return (
      <div>
        {error
          ? '글이 없어!'
          : <p>
            제목 : {post.title}<br/>
            카테고리 : {post.category.name}<br/>
            작성자 : {post.author.profileName}<br/>
            내용 : {post.contents}
          </p>
        }
      </div>
    );
  }
}

export default Post;