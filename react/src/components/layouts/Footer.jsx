import React from 'react'
import logo from './logo.png';
import {Link} from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
       <div className='section section_footer'>
          <div className='container'>
            <div className='about'>
              <img src={logo} alt='logo'/>
              <p className='common_para'>If you’re hosting a meeting or getting a team of people to collaborate, sending them an editable link is the fastest way to get everyone to work together on the same drawing board.</p>
            </div>
            <div className='link flex flex_d_col'>
              <h3>Quick Links</h3>
              <Link to='/'>Home</Link>
              <Link to='/'>About</Link>
              <Link to='/'>Contact</Link>
              <Link to='/'>My Sketch</Link>
            </div>
            <div className='legal flex flex_d_col'>
              <h3>Legal Stuff</h3>
              <Link to='/'>Privacy Notice</Link>
              <Link to='/'>Cookie Policy</Link>
              <Link to='/'>Terms Of Use</Link>
              <Link to='/'>Policy</Link>
            </div>
          </div>
       </div>
       <div style={{padding: '2rem', borderTop: '.1rem solid grey'}}>
          <p className='common_para' style={{textAlign: 'center'}}>
          © Copy right 2022 | | <a href='#'>Sketchpad.com</a>
          </p>
       </div>
    </footer>
  )
}

export default Footer;