import React, { useState } from 'react';
import Service from './Service';
import Content from './Content';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { useNavigate } from 'react-router-dom';

import './styles.css';

export let image;

const Home = () => {
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(true);

    const readFileSync = (file) => {
        return new Promise((res,rej) => {
            let reader = new FileReader();
            reader.onload = e => {
                    const data = atob(e.target.result.replace(/.*base64,/,''));
                    res(data);
            }
            reader.onerror = err => {
                rej(err);
            }
            reader.readAsDataURL(file);
        })
    }

    const imageToBase64 = (file) => {
        return new Promise((res,rej) => {
            const reader = new FileReader();
            reader.onload = () => {
                if(reader.readyState === 2){
                    res(reader.result);
                }
            }
            reader.readAsDataURL(file);
        })
    }

    async function onUpload(e) {
        const file = e.target.files[0];
        const data = await readFileSync(file);
        let fileExtension = file.name.split('.');
        fileExtension = fileExtension[fileExtension.length -1];
        if(fileExtension !== 'pdf'){
            image = await imageToBase64(file);
            setDisabled(false)
            return
        }

        renderPDF(data);
      }
       
      
      async function renderPDF(data) {
        try{
            const pdf = await window.pdfjs.getDocument({data}).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({scale: 2});
            const canvas = document.createElement('canvas');
            const canvasContext = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            await page.render({canvasContext, viewport}).promise;
            const firstImage = canvas.toDataURL('image/png');
            image = firstImage;
            setDisabled(false)
        }catch(err){
            image = null;
        }   
    }

      const submitHandler = (e) => {
        e.preventDefault();
        navigate('/drawing');

      }
  return (
    <>
        <Header/>
        <main className='section section_hero'>
            <div className='container'>
                <div className='content_box flex justify_center align_items flex_d_col'>
                    <h1 className='heading'>Draw on picture</h1>
                    <p className='para'>The easiest way to draw and share Maps! Enter the location where do you want to go.</p>
                    <form className='flex justify_center align_items flex_d_col' onSubmit={submitHandler}>
                        <div className='search_box flex'>
                            <input type='text' placeholder='https://example.com/image.jpg'/>
                            <label htmlFor='file'>
                                Take Photo
                                <input type='file' id='file' onChange={onUpload}/>
                            </label>
                        </div>
                        <button className='btn' type='submit' disabled={disabled}>Open Sketch</button>
                    </form>
                </div>
            </div>
        </main>
        <Service/>
        <Content/>
        <Footer/>
    </>
  )
}

export default Home