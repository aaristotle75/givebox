import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends Component {

  render() {

    return (
      <nav className='sideBar'>
        <ul>
          <NavLink to='/dashboard'>Dashboard</NavLink>
        </ul>
      </nav>
    )
  }
}

const NavLink = props => (
  <li>
    <Link {...props} style={{ color: 'inherit' }} />
  </li>
);
