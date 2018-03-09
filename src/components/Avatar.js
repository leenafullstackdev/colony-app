import React, { Component } from 'react';
import './Avatar.css';

class Avatar extends Component {
  constructor() {
    super();
    this.state = {
      showPopover: false,
      selectedAvatar: null,
      avatarId: null,
      avatars: [],
    }
    this.handleClick = this.handleClick.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentWillMount() {
    fetch('http://localhost:3001/avatars?_limit=1').then(avatar => {
      return avatar.json();
    }).then(selectedAvatar => {
      this.setState({ selectedAvatar: selectedAvatar[0] });
    });     
  }

  handleClick() {
    const { showPopover } = this.state;
     if (!showPopover) {
      fetch('http://localhost:3001/avatars').then(avatars => {
        return avatars.json();
      }).then(avatars => {
        this.setState({ avatars });
      }); 
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
    const { showPopover, selectedAvatar, avatarId, avatars } = this.state;

    return (
      <div>
        {selectedAvatar && <img src={selectedAvatar.src} alt='Click Me!' title="Click Me!" onClick={this.handleClick} className='img' />}
        {showPopover && 
        <div className='avatar-popover'>
          <p className="arrow"></p>
          <div className='avatar-list' ref={node => { this.node = node; }}>
            <label>Choose your avatar</label>
            <ul>
              {avatars.map(avatar => {
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