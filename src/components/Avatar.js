import React, { Component } from 'react';
import './Avatar.css';

const Avatars = [
  { "src": "images/avatar1.png", "label": "Avatar 1", "id": 1 },
  { "src": "images/avatar2.png", "label": "Avatar 2", "id": 2 },
  { "src": "images/avatar3.png", "label": "Avatar 3", "id": 3 },
  { "src": "images/avatar4.png", "label": "Avatar 4", "id": 4 },
  { "src": "images/avatar5.png", "label": "Avatar 5", "id": 5 },
  { "src": "images/avatar6.png", "label": "Avatar 6", "id": 6 }
]

class Avatar extends Component {
  constructor() {
    super();
    this.state = {
      showPopover: false,
      selectedAvatar: Avatars[0],
      avatarId: null,
    }
    this.handleClick = this.handleClick.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  handleClick() {
    const { showPopover } = this.state;
     if (!showPopover) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState({ showPopover: !showPopover });
  }

  changeImage(avatarId) {
    this.setState({ avatarId });
    setTimeout(() => {
      fetch(`http://localhost:3001/avatars/${avatarId}`).then(avatar => {
      return avatar.json();
      }).then(selectedAvatar => {
        this.setState({ selectedAvatar, showPopover: false });
      });      
      document.removeEventListener('click', this.handleOutsideClick, false);
    }, 1000);
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    }

    this.handleClick();
  }

  render() {
    const { showPopover, selectedAvatar, avatarId } = this.state;
    console.log(avatarId);
    return (
      <div>
        <img src={selectedAvatar.src} alt='Click Me!' title="Click Me!" onClick={this.handleClick} className='img' />
        {showPopover && 
        <div className='avatar-popover'>
          <p className="arrow"></p>
          <div className='avatar-list' ref={node => { this.node = node; }}>
            <label>Choose your avatar</label>
            <ul>
              {Avatars.map(avatar => {
                return (
                  <li key={avatar.id} className={selectedAvatar.id === avatar.id ? 'active' : ''} onClick={() => this.changeImage(avatar.id)}>
                    <div className={avatarId === avatar.id ? 'spinner' : ''}></div>
                    <div className="circle-main">
                     
                        <img src={avatar.src} title={avatar.label} alt={avatar.label} />
                     
                    </div>
                  </li>)
              })}
              <div className="clearfix"></div>
            </ul>
          </div>
        </div>
      }
      </div>
    )
  }
}

export default Avatar;