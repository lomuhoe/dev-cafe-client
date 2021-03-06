import React from 'react';
import PropTypes from 'prop-types';

import withToken, { tokenPropType } from '../../containers/WithToken';
import withOpenAlert, { openAlertPropType } from '../../containers/WithOpenAlert';
import withEditingCommentContainer, { EditingCommentContainerPropTypes, EditingCommentContainerDefaultProps } from '../../containers/EditingCommentContainer';
import withToastAddNotification, { addToastNotificationPropInfo } from '../toastNotifications/WithAddToastNotification';

import { connectComponent } from '../../utils';
import * as Api from '../../api/comments';

import Editor from '../contents/CommentEditor';

import './EditComment.scss';

class EditComment extends React.Component {
  constructor(props) {
    super(props);
    const { editingComment } = this.props;

    // editingComment가 없다 === 스토어에 댓글 정보를 등록중이다.
    this.state = {
      editingComment,
      isLoading: typeof editingComment === 'undefined',
      isDone: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { isLoading } = prevState;

    if (isLoading === false) {
      return null;
    }

    const { editingComment } = nextProps;
    if (editingComment) {
      return {
        ...prevState,
        editingComment,
        isLoading: false,
      };
    }

    return null;
  }

  componentWillUnmount() {
    const { isLoading, isDone, editingComment } = this.state;
    if (isLoading === false && isDone === false) {
      const { saveEditingComment } = this.props;
      saveEditingComment(editingComment);
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { editingComment } = this.state;
    const {
      token, offEditMode, editingCommentDone, openAlert, addToastNotification,
    } = this.props;

    const editedComment = {
      _id: editingComment._id,
      contents: editingComment.contents,
    };
    Api.updateComment(editedComment, token)
      .then(() => {
        this.setState(prevState => ({
          ...prevState,
          isDone: true,
        }));
        editingCommentDone(editedComment._id);
        offEditMode();
        addToastNotification({
          message: '댓글이 수정되었습니다!!',
        });
      })
      .catch((err) => {
        openAlert(
          { message: err.response.data.message },
        );
      });
  }

  onChange = (value) => {
    this.setState(prevState => ({
      ...prevState,
      editingComment: {
        ...prevState.editingComment,
        contents: value,
      },
    }));
  }

  render() {
    const { editingComment, isLoading } = this.state;

    return (
      <div className="EditComment">
        <Editor
          contents={isLoading ? 'Loading...' : editingComment.contents}
          onChange={this.onChange}/>
        <div className="edit-comment-button-group">
          <button type="button" onClick={this.onSubmit}>
          등록
          </button>
        </div>
      </div>
    );
  }
}

EditComment.propTypes = {
  token: tokenPropType.type,
  openAlert: openAlertPropType.type.isRequired,
  addToastNotification: addToastNotificationPropInfo.type.isRequired,
  offEditMode: PropTypes.func.isRequired,
  editingComment: EditingCommentContainerPropTypes.editingComment,
  saveEditingComment: EditingCommentContainerPropTypes.saveEditingComment.isRequired,
  editingCommentDone: EditingCommentContainerPropTypes.editingCommentDone.isRequired,
};

EditComment.defaultProps = {
  token: tokenPropType.default,
  editingComment: EditingCommentContainerDefaultProps.editingComment,
};

export default connectComponent(EditComment,
  [
    withToken,
    withOpenAlert,
    withToastAddNotification,
    withEditingCommentContainer,
  ]);
