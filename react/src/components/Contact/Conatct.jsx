import React from 'react'
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import '../home/styles.css';

const Conatct = () => {
  return (
    <>
      <Header/>
      <section className='section_contact section'>
        <h1 className='common_heading text_center'>Conatct Us</h1>
        <div className='container'>
          <form>
            <div className='col_2'>
              <div className='input flex flex_d_col'>
                <label htmlFor='name'>Name :</label>
                <input type='text' placeholder='Enter your name' id='name'/>
              </div>
              <div className='input flex flex_d_col'>
                <label htmlFor='email'>Email :</label>
                <input type='email' placeholder='Enter your Email' id='email'/>
              </div>
            </div>
            <div className='input flex flex_d_col'>
                <label htmlFor='subject'>Subject :</label>
                <input type='text' placeholder='Subject' id='subject'/>
            </div>
            <div className='input flex flex_d_col'>
                <label htmlFor='message'>Message :</label>
                <textarea placeholder='Message' id='message'/>
              </div>
          </form>
        </div>
      </section>
      <Footer/>
    </>
  )
}

export default Conatct