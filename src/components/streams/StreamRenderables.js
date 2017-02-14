import React from 'react'
import { preferenceToggleChanged } from '../../helpers/junk_drawer'
import CategoryContainer from '../../containers/CategoryContainer'
import CommentContainer from '../../containers/CommentContainer'
import NotificationContainer from '../../containers/NotificationContainer'
import PostContainer from '../../containers/PostContainer'
import UserContainer from '../../containers/UserContainer'
import Preference from '../../components/forms/Preference'
import TreeButton from '../../components/navigation/TreeButton'
import TreePanel from '../../components/navigation/TreePanel'
import { isElloAndroid } from '../../lib/jello'

export const categoriesAsGrid = categories =>
  <div className="Categories asGrid">
    {categories.data.map(category =>
      <CategoryContainer
        categoryId={category.get('id')}
        key={`categoryGrid_${category.get('id')}`}
      />,
    )}
  </div>

export const usersAsGrid = users =>
  <div className="Users asGrid">
    {users.data.map(user =>
      <UserContainer
        key={`userGrid_${user.get('id')}`}
        type="grid"
        userId={user.get('id')}
      />,
    )}
  </div>

export const usersAsInviteeList = invitations =>
  <div className="Users asInviteeList">
    {invitations.data.map(invitation =>
      <UserContainer
        invitationId={invitation.get('id')}
        key={`userInviteeList_${invitation.get('id')}`}
        type="invitee"
        userId={invitation.getIn(['links', 'acceptedBy', 'id'])}
      />,
    )}
  </div>

export const usersAsInviteeGrid = invitations =>
  <div className="Users asInviteeGrid">
    {invitations.data.map(invitation =>
      <UserContainer
        className="UserInviteeGrid"
        invitationId={invitation.get('id')}
        key={`userInviteeGrid_${invitation.get('id')}`}
        type="invitee"
        userId={invitation.getIn(['links', 'acceptedBy', 'id'])}
      />,
    )}
  </div>

export const postsAsGrid = (posts, columnCount, isPostHeaderHidden) => {
  const columns = []
  for (let i = 0; i < columnCount; i += 1) {
    columns.push([])
  }
  Object.keys(posts.data).forEach((index) => {
    columns[index % columnCount].push(posts.data[index])
  })
  return (
    <div className="Posts asGrid">
      {columns.map((columnPosts, i) =>
        <div className="Column" key={`column_${i + 1}`}>
          {columnPosts.map(post =>
            <article className="PostGrid" key={`postsAsGrid_${post.get('id')}`}>
              <PostContainer postId={post.get('id')} isPostHeaderHidden={isPostHeaderHidden} />
            </article>,
          )}
        </div>,
      )}
    </div>
  )
}

export const postsAsList = (posts, columnCount, isPostHeaderHidden) =>
  <div className="Posts asList">
    {posts.data.map(post =>
      <article className="PostList" key={`postsAsList_${post.get('id')}`}>
        <PostContainer postId={post.get('id')} isPostHeaderHidden={isPostHeaderHidden} />
      </article>,
    )}
  </div>

export const commentsAsList = comments =>
  <div>
    {comments.data.map(comment =>
      <CommentContainer
        commentId={comment.get('id')}
        key={`commentContainer_${comment.get('id')}`}
      />,
    )}
  </div>

export const notificationList = notifications =>
  <div className="Notifications">
    {notifications.data.map((notification, i) =>
      <NotificationContainer
        key={`notificationParser_${notification.get('createdAt', Date.now())}_${i + 1}`}
        notification={notification}
      />,
    )}
  </div>

export const userAvatars = users =>
  users.data.map(user =>
    <UserContainer
      key={`userAvatar_${user.get('id')}`}
      type="avatar"
      userId={user.get('id')}
    />,
  )

export const profileToggles = settings =>
  settings.data.map((setting, index) => {
    if (!isElloAndroid() && setting.get('label').toLowerCase().indexOf('push') === 0) { return null }
    const arr = [<TreeButton key={`settingLabel_${setting.get('label')}`}>{setting.get('label')}</TreeButton>]
    arr.push(
      <TreePanel key={`settingItems_${setting.get('label', index)}`}>
        {setting.get('items').map(item =>
          <Preference
            definition={{ term: item.get('label'), desc: item.get('info') }}
            id={item.get('key')}
            key={`preference_${item.get('key')}`}
            onToggleChange={preferenceToggleChanged}
          />,
        )}
      </TreePanel>,
    )
    return arr
  })

export const blockedMutedUserList = users =>
  users.data.map(user =>
    <UserContainer
      key={`userCompact_${user.get('id')}`}
      type="compact"
      userId={user.get('id')}
    />,
  )

