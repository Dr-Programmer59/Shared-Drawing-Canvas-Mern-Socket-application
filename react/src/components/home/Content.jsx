import React, { Fragment } from 'react'

const Content = () => {
  const cardData = [
    {
      heading: 'Real-time collaboration. The natural approach to visual communication.',
      para: 'If you’re hosting a meeting or getting a team of people to collaborate, sending them an editable link is the fastest way to get everyone to work together on the same drawing board.',
      image: 'https://sketchpad.pro/images/index/real-time.jpg'
    },
    {
      heading: 'Real-time collaboration. The natural approach to visual communication.',
      para: 'If you’re hosting a meeting or getting a team of people to collaborate, sending them an editable link is the fastest way to get everyone to work together on the same drawing board.',
      image: 'https://sketchpad.pro/images/index/real-time.jpg'
    },
    {
      heading: 'Real-time collaboration. The natural approach to visual communication.',
      para: 'If you’re hosting a meeting or getting a team of people to collaborate, sending them an editable link is the fastest way to get everyone to work together on the same drawing board.',
      image: 'https://sketchpad.pro/images/index/real-time.jpg'
    },
  ]
  return (
    <section className='section section_content'>
        <div className='container'>
            {
              cardData.map(({heading, para, image},index) => {
                return(
                  <Fragment key={index}>
                    {
                      index%2 !== 0
                      ?
                      <div className='card'>
                        {/* left side */}
                        <div className='left_side'>
                          <h2 className='common_heading'>{heading}</h2>
                          <p className='common_para'>{para}</p>
                        </div>
                        {/* right side  */}
                        <div className='right_side'>
                          <img src={image} alt='image'/>
                        </div>
                      </div>
                      :
                      <div className='card left_card'>
                      {/* left side */}
                      <div className='right_side top'>
                        <img src={image} alt='image'/>
                      </div>
        
                      {/* right side  */}
                      <div className='left_side'>
                        <h2 className='common_heading'>{heading}</h2>
                        <p className='common_para'>{para}</p>
                      </div>
                    </div>

                    }
                  </Fragment>
                );
              })
            }
        </div>
    </section>
  )
}

export default Content