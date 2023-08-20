import React from 'react'
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import '../home/styles.css';

const About = () => {
  return (
    <>
      <Header/>
      <section className='section_about section'>
        <h1  className='common_heading text_center'>About Us</h1>
        <div className='container col_2'>
          <div className='image'>
            <img src='/images/about.jpg'/>
          </div>
          <div className='about'>
            <p className='common_para'>
              Occaecat aliqua incididunt tempor Lorem veniam duis eu nostrud. Incididunt Lorem anim pariatur ex id magna nisi eu reprehenderit ex ad magna. Est anim occaecat tempor esse voluptate quis officia nisi excepteur ex cillum irure elit occaecat. Id eu incididunt duis est cillum aliqua proident amet dolore eu velit nostrud. Nulla proident elit excepteur minim. Ipsum irure consectetur adipisicing veniam nisi adipisicing nisi in ut anim. Laborum reprehenderit ex reprehenderit qui eiusmod reprehenderit ex non occaecat aute velit ipsum pariatur fugiat.
             Esse adipisicing mollit ea magna do laboris minim consequat proident. Tempor excepteur velit enim non do do voluptate nulla consequat. Exercitation ut adipisicing minim ipsum duis exercitation laborum enim incididunt. Exercitation anim Lorem quis nulla laborum esse veniam in officia tempor do. Minim enim et do do exercitation id sint non. Magna incididunt Lorem irure dolor elit culpa nisi et ut sint. Commodo pariatur eiusmod adipisicing ea.
            </p>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  )
}

export default About