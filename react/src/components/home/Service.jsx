import React from 'react'

const Service = () => {
  return (
    <section className='section section_service'>
        <div className='container'>
            <div className='card_box col_3'>
                <div className='card flex flex_d_col'>
                    <h2 className='common_heading'>Draw</h2>
                    <p className='common_para'>Sketchpad.pro is like paint for the web - it's the fastest way to get simple drawing editor without needing any downloads or installations.</p>
                </div>
                <div className='card flex flex_d_col'>
                    <h2 className='common_heading'>Share</h2>
                    <p className='common_para'>Using Sketchpad.pro you can save your sketches on your computer as well as in the cloud. This make sharing as simple as just sending a link or file.</p>
                </div>
                <div className='card flex flex_d_col'>
                    <h2 className='common_heading'>Collaborate</h2>
                    <p className='common_para'>Sketchpad.pro is a collaborative real-time graphic editor. Each user can draw on this same canvas simultaneously.</p>
                </div>
            </div>
            <div>
                <a href='#' className='btn'>Open Sketch</a>
            </div>
        </div>
    </section>
  )
}

export default Service