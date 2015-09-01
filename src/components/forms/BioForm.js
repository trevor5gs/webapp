import React from 'react'
import NameControl from './NameControl'

class BioForm extends React.Component {

  handleSubmit(e) {
    e.preventDefault()
    console.log('Bio Form handleSubmit', arguments)
  }


  render() {
    return (
      <form className="BioForm" onSubmit={this.handleSubmit} role="form" noValidate="novalidate">
        <figure className="Avatar"></figure>
        <NameControl tabIndex="1"/>
        <p>Bio</p>
        <p>Links</p>
      </form>
    )
  }

}

export default BioForm


// <form accept-charset="UTF-8" action="/api/v1/settings/profile" class="simple_form form edit_user" id="bio_form" method="post" novalidate="novalidate" role="form">
//   <fieldset>
//     <div class="form-group string optional user_name" data-status="">
//       <label class="string optional form__label form-label" for="user_name">Name</label>
//       <input class="string optional form__control form-control" id="user_name" name="user[name]" placeholder="—" type="text" value="Matthew Kitt">
//     </div>

//     <div class="form-group text optional user_unsanitized_short_bio" data-status="">
//       <label class="text optional form__label form-label" for="user_unsanitized_short_bio">Bio<span></span></label>
//       <textarea class="text optional form__control form-control" id="user_unsanitized_short_bio" name="user[unsanitized_short_bio]" placeholder="— (192 character limit)">Milk runs.</textarea>
//     </div>

//     <div class="form-group string optional user_links" data-status="">
//       <label class="string optional form__label form-label" for="user_links">Links</label>
//       <input class="string optional form__control form-control" id="user_links" name="user[links]" placeholder="ex. https://ello.co, http://awesome.com, http://evil.com" type="text" value="modeset.com, ello.co, mkitt.net">
//     </div>

//   </fieldset>
// </form>

