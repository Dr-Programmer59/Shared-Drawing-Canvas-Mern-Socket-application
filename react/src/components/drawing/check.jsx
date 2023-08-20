import React, {useEffect, useRef, useState, Fragment, useLayoutEffect, useCallback} from 'react'
import {fabric} from 'fabric'
import { SketchPicker } from 'react-color';
import io from 'socket.io-client';
import './style.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import ReactScrollToBottom from 'react-scroll-to-bottom';
import Message from './Message';



import {GrMenu, GrClose} from 'react-icons/gr';
import {BsSquare, BsCircle, BsPencil, BsFillLayersFill} from 'react-icons/bs';
import {AiOutlineSelect,AiOutlineZoomOut,AiOutlineZoomIn, AiOutlineBackward, AiFillForward} from 'react-icons/ai';
import {HiOutlineMinus} from 'react-icons/hi';
import {RiGalleryFill} from 'react-icons/ri';
import {CgColorPicker} from 'react-icons/cg';
import {FiShare2} from 'react-icons/fi';
import {TbViewportNarrow} from 'react-icons/tb';
import {MdOutlineMessage} from 'react-icons/md';
import {BiSend, BiText, BiAddToQueue, BiReset} from 'react-icons/bi';
import { image } from "../home/Home";
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';


const getSvgPathFromStroke = stroke => {
  if (!stroke.length) return "";
  let path = '';
  stroke.forEach(point => {
    point = point.join(' ');
    path += ' ' + point; 
  });

  return path;
};

fabric.Object.prototype.getZIndex = function() {
    return this.canvas.getObjects().indexOf(this);
}

fabric.Canvas.prototype.addToPosition = function(object,position) {
    while(object.getZIndex() < this.getObjects().length-1) {
        this.bringForward(object);
    }
}



let canvas;
let newLine;
let newRectangle;
let newCircle;
let drawing = false;
let tool = 'line';
let origX;
let origY;
let circleX1;
let color = 'black';
let strokeSize = 3;
let socket;
let roomSec = null;
let myPoint = {x: 0, y: 0};
let myWidth = window.innerWidth;
let myHeight = window.innerHeight;
let myZoom = 1;
let zoomPoint = {x: 0, y: 0}
let userId = null;
let unseen = 0;
let messBox = false;
let timerId = null;
let recycle = [];
const FabricJSCanvas = () => {

  const [navActive, setNavActive] = useState(false);
  const [boxColor, setBoxColor] = useState('black');
  const [strokeBoxSize, setStrokeBoxSize] = useState(3);
  const [colorBoxOpen, setColorBoxOpen] = useState(false);
  const [strokeActive, setStrokeActive] = useState(false);
  const sizeList = [1,2,3,4,5,6,7,8,9,10];
  const canvasRef = useRef(null);
  const boxRef = useRef(null);
  const [myId, setMyId] = useState('');
  const [data, setData] = useState([]);
  const {roomId} = useParams();
  const [room, setRoom] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [point, setPoint] = useState(null);
  const [message, setMessage] = useState([]);
  const [myName, setMyName] = useState(null);
  const messageRef = useRef(null);
  const [messageBox, setMessageBox] = useState(false);
  const [type, setType] = useState('');
  const [textOpen, setTextOpen] = useState(false);
  const [text, setText] = useState('');
  const [font, setFont] = useState(30);
  const serverUrl = 'http://localhost:4000/';


  const handleMirror = useCallback(() => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const zoom = canvas.getZoom();
    const {scrollTop, scrollLeft} = boxRef.current;
    setWidth(width);
    setHeight(height);
    setZoom(zoom);
    setPoint({y: scrollTop, x: scrollLeft});
    setData(canvas.getObjects());
    
    if(roomId){
      socket.emit('mirror',{roomId, width, height, zoom, scrollTop, scrollLeft, zoomPoint});
    }else{
      socket.emit('mirror',{roomId: roomSec, width, height, zoom, scrollTop, scrollLeft, zoomPoint});
    }
  },[]);

  const onDraw = useCallback(() => {
    const elements = canvas.getObjects();
    if(roomId){
      socket.emit('send-element',{roomId,elements});
    }else{
      socket.emit('send-element',{roomId: roomSec, elements});
    }
  },[]);

  const handlleRoom = useCallback(({roomId: Room}) => {
    setRoom(Room);
    roomSec = Room;
  },[]);

  const hanlderNewUserJoin = useCallback(({name}) => {
    toast.info(`${name} join the room`);
    const elements = canvas.getObjects();
    if(roomId){
      socket.emit('send-element', {elements, roomId});
    }else{
      socket.emit('send-element', {elements, roomId: roomSec});
    }
  },[]);

  const createRoom = useCallback((id) => {
    socket.emit('create-room',{userId: id});
  },[]);

  const hanlderRiciveElement = useCallback(({elements}) => {
    setData([...elements]);
  },[]);

  const handleMirrorRecive = useCallback(({width, height, zoom, scrollTop, scrollLeft, zoomPoint: zoomP}) => {
    setWidth(width);
    setHeight(height);
    setZoom(zoom);
    setPoint({y: scrollTop, x: scrollLeft});
    myWidth = width;
    myHeight = height;
    myZoom = zoom;
    myPoint = {y: scrollTop, x: scrollLeft};
    zoomPoint = zoomP;
  },[]);

  const handleLeave = useCallback(({name}) => {
    toast.info(`${name} left the room`);
  },[]);

  const handleMessage = useCallback((data) => {
    setMessage(prove => [...prove, data]);
    if(!messBox){
      unseen += 1;
    }
  },[]);

  const toggleMessage = useCallback(() => {
    setMessageBox(!messageBox);
    unseen = 0;
    messBox = !messBox;
  },[messageBox]);

  const sendMessage = useCallback((e) => {
    e.preventDefault();
    const mess = messageRef.current.value;
    if(!mess){
      return
    }

    if(roomId){
      socket.emit('send-message',{roomId,message: mess, userId});
    }else{
      socket.emit('send-message',{roomId: roomSec, message: mess, userId});
    }
    messageRef.current.value = '';
    const data = {message: mess, id: userId, name: myName}
    setMessage(prave => [...prave,data]);
  },[]);

  function debounce (func, timer)
  {
    if(timerId){
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func();
    }, timer);
  }

  const handleTyping = useCallback((data) => {
    setType(`${data.name} is typing...`);
    debounce(function (){
      setType('');
    },1000);
  },[]);

  useEffect(() => {
    socket = io(serverUrl,{transports: ['websocket']});
    socket.on('connect',() => {
    setMyId(socket.id);
    userId = socket.id;
    if(roomId){
      const name = window.prompt('Please Enter Your Name') || 'unknown';
      setMyName(name);
      socket.emit('join-room',{roomId, name, userId: socket.id});
    }else{
      createRoom(socket.id);
    }
    });

    socket.on('create-room', handlleRoom);
    socket.on('new-user', hanlderNewUserJoin);
    socket.on('recive-element', hanlderRiciveElement);
    socket.on('mirror', handleMirrorRecive);
    socket.on('leave', handleLeave);
    socket.on('send-message',handleMessage);
    socket.on('typing',handleTyping);

    return () => {
      socket.off('create-room', handlleRoom);
      socket.off('new-user', hanlderNewUserJoin);
      socket.off('recive-element',hanlderRiciveElement);
      socket.off('mirror', handleMirrorRecive);
      socket.off('leave', handleLeave);
      socket.off('send-message',handleMessage);
      socket.off('typing',handleTyping);
    }

  },[]);

  // useEffect(() => {
  //   socket.on('send-message',handleMessage);

  //   return () => {
  //     socket.on('send-message',handleMessage);
  //   }
  // },[])

  useLayoutEffect(() => {
    const options = {
      width: window.innerWidth,
      height: window.innerHeight,
      selection: false,
      selectable: false
    }
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, window.innerWidth, window.innerWidth);

    canvas = new fabric.Canvas(canvasRef.current,options);
    canvas.clear();
    // canvas.on('mouse:wheel', function(opt) {
    //   var delta = opt.e.deltaY;
    //   var zoom = canvas.getZoom();
    //   zoom *= 0.999 ** delta;
    //   if (zoom > 20) zoom = 20;
    //   if (zoom < 0.01) zoom = 0.01;
    //   canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    //   canvas.setWidth(canvas.getWidth() + 10);
    //   canvas.setHeight(canvas.getHeight() + 10);
    //   opt.e.preventDefault();
    //   opt.e.stopPropagation();
    //   myWidth = canvas.getWidth();
    //   myHeight = canvas.getHeight();
    //   myZoom = canvas.getZoom();
    //   zoomPoint = { x: opt.e.offsetX, y: opt.e.offsetY }
    // });

    if(image){
      fabric.Image.fromURL(image,function(img){
        img.set('left',window.innerWidth/3).set('top',window.innerHeight/3)
        canvas.add(img);
        canvas.requestRenderAll();
      });
    }

    if(data.length !== 0){
        data.forEach(({type,width,height,top,left,stroke,strokeWidth,fill,radius,angle,x1,x2,y1,y2,path,src,scaleX,scaleY,skewX,skewY, text, fontSize}) => {
          switch(type){
            case 'rect':
              newRectangle = new fabric.Rect({
                width,
                height,
                top,
                left,
                stroke,
                strokeWidth,
                fill,
                angle,
                scaleX,scaleY,skewX,skewY
              });
              canvas.add(newRectangle);
              canvas.requestRenderAll();
              break;
            case "circle":
              newCircle = new fabric.Circle({
                left,
                top,
                radius,
                stroke,
                strokeWidth,
                fill,
                angle,
                scaleX,scaleY,skewX,skewY
              });
              canvas.add(newCircle);
              canvas.requestRenderAll();
              break;
            case 'line':
              newLine = new fabric.Line([left,top,width+left,height+top],{
                stroke,
                strokeWidth,
                angle,
                scaleX,scaleY,skewX,skewY
              });
              canvas.add(newLine);
              canvas.requestRenderAll();
              break;
            case 'path':
              const stroke22 = getSvgPathFromStroke(path);
              const pencil = new fabric.Path(stroke22,{
                stroke,
                strokeWidth,
                angle,
                fill: 'transparent',
                scaleX,scaleY,skewX,skewY
              });
              canvas.add(pencil);
              canvas.requestRenderAll();
              break;
            case "image":
              fabric.Image.fromURL(src,function(img){
                img.set({left,top,width,height,angle,scaleX,scaleY,skewX,skewY})
                canvas.add(img);
                canvas.requestRenderAll();
              });
              break;
            case "text":
              const newText = new fabric.Text(text, {
                width,
                height,
                fontSize,
                fill,
                angle,
                scaleX,scaleY,skewX,skewY,
                top,
                left
              });
              canvas.add(newText);
              canvas.requestRenderAll();
              break;
          }
        });
    }
    if(width && height && zoom && point){
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.setZoom(zoom);
      canvas.zoomToPoint(zoomPoint,zoom);
      boxRef.current.scrollTo(point.x, point.y);
    }else{
      canvas.setWidth(myWidth);
      canvas.setHeight(myHeight);
      canvas.setZoom(myZoom);
      boxRef.current.scrollTo(myPoint.x, myPoint.y);
      canvas.zoomToPoint(zoomPoint,myZoom);
    }

    return () => {
      canvas.dispose()
    }

  }, [data, width, height, zoom, point]);

  const handelPencil = useCallback(() => {
    if(recycle.length !== 0){
      recycle = [];
    }
    canvas.off('mouse:down',handleMouseDown);
    canvas.off('mouse:move',handleMouseMove);
    canvas.off('mouse:up',handleMouseUp);
    canvas.isDrawingMode = true;
    canvas.selectable = false;
    canvas.evented = false;
    setStrokeActive(!strokeActive);
    tool = 'pencil';
    canvas.forEachObject(function(object){ 
      object.selectable = false;
      object.hoverCursor = 'auto'; 
    });
    
  },[]);


 // add text 
  const addText = () => {
    if(!text || !font) return;
    setText('');
    const newText = new fabric.Text(text,{fill: color, fontSize: font, top: window.innerHeight/2, left: window.innerWidth/2});
    canvas.add(newText);
    canvas.requestRenderAll();
    if(recycle.length !== 0){
      recycle = [];
    }
  }


  const handlerSelect = useCallback(() => {
    canvas.selection = true;
    canvas.selectable = true;
    canvas.evented = true;
    canvas.off('mouse:down',handleMouseDown);
    canvas.off('mouse:move',handleMouseMove);
    canvas.off('mouse:up',handleMouseUp);
    canvas.isDrawingMode = false;
    tool = 'selection';
    canvas.forEachObject(function(object){ object.selectable = true });
    if(recycle.length !== 0){
      recycle = [];
    }
  },[]);

  const toolHandler = useCallback((toolName) => {
    tool = toolName;
    canvas.isDrawingMode = false;
    canvas.selectable = false;
    canvas.selection = false;
    canvas.evented = false;
    canvas.on('mouse:down',handleMouseDown);
    canvas.on('mouse:move',handleMouseMove);
    canvas.on('mouse:up',handleMouseUp);
    canvas.forEachObject(function(object){ 
      object.selectable = false;
      object.hoverCursor = 'auto'; 
    });

    if(recycle.length !== 0){
      recycle = [];
    }
  },[]);

  function handleMouseDown(o){
    const pointer = canvas.getPointer(o.e);
    drawing = true;
    if(tool == 'line'){
      newLine = new fabric.Line([pointer.x, pointer.y ,pointer.x, pointer.y],{
        stroke: color,
        strokeWidth: 3
      });
      canvas.add(newLine);
      canvas.requestRenderAll();
      canvas.selectable = false;
    }else if(tool == 'rectangle'){
      origX = pointer.x;
      origY = pointer.y;
      newRectangle = new fabric.Rect({
        width: 0,
        height: 0,
        top: pointer.y,
        left: pointer.x,
        stroke: color,
        strokeWidth: 3,
        fill: 'transparent'
      });
      canvas.add(newRectangle);
      canvas.requestRenderAll();
      canvas.selectable = false;
    }else if(tool == 'circle'){
      circleX1 = pointer.x;
      newCircle = new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        radius: 0,
        stroke: color,
        strokeWidth: 3,
        fill: 'transparent'
      });
      canvas.add(newCircle);
      canvas.requestRenderAll();
      canvas.selection = false;
      canvas.selectable = false;
    }
  };

  function handleMouseMove(o){
    const pointer = canvas.getPointer(o.e);
    if(!drawing){
      return false
    }

    if(tool == 'line'){
      newLine.set({
        x2: pointer.x,
        y2: pointer.y
      });
    }else if(tool == 'rectangle'){
      let x = Math.min(pointer.x, origX);
      let y = Math.min(pointer.y, origY);
      let w = Math.abs(origX - pointer.x);
      let h = Math.abs(origY - pointer.y);
      newRectangle.set('top',y).set('left',x).set('height',h).set('width',w)
    }else if(tool == 'circle'){
      newCircle.set('radius',Math.abs(pointer.x - circleX1));
    }
    canvas.requestRenderAll();
    canvas.selectable = false;
  };

  const handleMouseUp = event => {
    drawing = false;
    const pointer = canvas.getPointer(event.e);
  };

  const handleZoomIn = useCallback(() => {
    canvas.setZoom(canvas.getZoom() + 0.1, canvas.getZoom() + 0.1);
    canvas.setWidth(canvas.getWidth() + 80);
    canvas.setHeight(canvas.getHeight() + 80);
    canvas.selectable = false;
    canvas.evented = false;
    myWidth = canvas.getWidth();
    myHeight = canvas.getHeight();
    myZoom = canvas.getZoom();
  },[]);

  const handleZoomOut = useCallback(() => {
    canvas.setZoom(canvas.getZoom() - 0.1, canvas.getZoom() - 0.1);
    canvas.selectable = false;
    canvas.evented = false;
  },[]);

  const handleZoomReset = useCallback(() => {
    canvas.setZoom(1,1);
    canvas.setWidth(window.innerWidth);
    canvas.setHeight(window.innerHeight);
    canvas.selectable = false;
    canvas.evented = false;
  },[]);

  const handleColor = useCallback((c) => {
    setBoxColor(c.hex);
    color = c.hex;
    canvas.freeDrawingBrush.color = c.hex;
  },[]);

  const handleStroke = useCallback((e) => {
    strokeSize = e.target.value;
    setStrokeBoxSize(e.target.value);

    canvas.freeDrawingBrush.width = parseInt(e.target.value, 10) || 1;
  },[]);

   // bg image handler 
  const readFileSync = useCallback((file) => {
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
    },[]);

    const imageToBase64 = useCallback((file) => {
        return new Promise((res,rej) => {
            const reader = new FileReader();
            reader.onload = () => {
                if(reader.readyState === 2){
                    res(reader.result);
                }
            }
            reader.readAsDataURL(file);
        })
    },[]);

    async function onUpload(e) {
        const file = e.target.files[0];
        let fileExtension = file.name.split('.');
        fileExtension = fileExtension[fileExtension.length -1];
        if(fileExtension !== 'pdf'){
            const imageLoad = await imageToBase64(file);
            if(imageLoad){
              fabric.Image.fromURL(imageLoad,function(img){
                img.set('left',window.innerWidth/3).set('top',window.innerHeight/3)
                canvas.add(img);
                canvas.requestRenderAll();
                canvas.selectable = false;
              });
            }
            return
        }

        const data = await readFileSync(file);
        renderPDF(data);
      }
       
      
      async function renderPDF(data) {
        try{
            const pdf = await window.pdfjs.getDocument({data}).promise;
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({scale: 2});
            const Dcanvas = document.createElement('canvas');
            const canvasContext = Dcanvas.getContext('2d');
            Dcanvas.height = viewport.height;
            Dcanvas.width = viewport.width;
            await page.render({canvasContext, viewport}).promise;
            const firstImage = Dcanvas.toDataURL('image/png');
            if(firstImage){
              fabric.Image.fromURL(firstImage,function(img){
                img.set('left',window.innerWidth/3).set('top',window.innerHeight/3)
                canvas.add(img);
                canvas.requestRenderAll();
                canvas.selectable = false;
              });
            }
        }catch(err){
            console.log(err.message)
        }   
    }

  const onScroll = useCallback(() => {
    const {scrollTop, scrollLeft} = boxRef.current;
    myPoint = {y: scrollTop, x: scrollLeft};
  },[]);

  const handleOnchange = useCallback(() => {
    if(roomId){
      socket.emit('typing',{roomId, userId});
    }else{
      socket.emit('typing',{roomId: roomSec, userId});
    }
  },[]);

  useEffect(() => {
    messageRef.current.addEventListener('keyup',handleOnchange);
    return () => {
      messageRef.current.removeEventListener('keyup',handleOnchange);
    }
  },[]);

  const deleteElement = useCallback((e) => {
    const keyID = e.keyCode;
    if(keyID == 8 || keyID == 46){
      const activeElement = canvas.getActiveObject();
      canvas.remove(activeElement);
      recycle.push(activeElement);
    }
  },[]);

  // add key event
  useEffect(() => {
    document.addEventListener('keydown',deleteElement);
    return () => {
      document.removeEventListener('keydown',deleteElement);
    }
  },[]);

  const handleBack = useCallback(() => {
    const lastEle = canvas.getObjects().pop();
    if(!lastEle) return;
    recycle.push(lastEle);
    canvas.remove(lastEle);
  },[]);

  const handleForward = useCallback(() => {
    if(recycle.length === 0) return;
    const lastEle = recycle.pop();
    canvas.add(lastEle);
    canvas.requestRenderAll();
  },[]);

  const handleLayer = useCallback(() => {
    const activeObject = canvas.getActiveObject();
    if(!activeObject) return;
    canvas.addToPosition(activeObject, 0);
  },[]);

  return (
  <>
    <div className='box' onMouseMove={() => onDraw()} ref={boxRef} onScroll={onScroll}>
      <nav className={`left_nav ${navActive ? 'active': ''}`}>
            <div className='buttons'>
                {
                  unseen === 0 ?
                  <button onClick={toggleMessage}><MdOutlineMessage/></button>
                  :
                  <button onClick={toggleMessage} className='unseen'><MdOutlineMessage/><span>{unseen < 10 ? unseen : '9+'}</span></button>
                }
                <button onClick={handleBack}><AiOutlineBackward/></button>
                <button onClick={handleForward}><AiFillForward/></button>
                <button onClick={handleMirror}><TbViewportNarrow/></button>
                <button onClick={handleZoomIn}><AiOutlineZoomIn/></button>
                <button onClick={handleZoomOut}><AiOutlineZoomOut/></button>
                <button onClick={handleZoomReset}><BiReset/></button>
                {
                  !roomId &&
                  <CopyToClipboard text={`${window.location.href}/${room}`}>
                    <button title='copy share link'><FiShare2/></button>
                  </CopyToClipboard>
                }
            </div>
        </nav>
        {   navActive
            ?
            <span className='menu'><GrClose onClick={() => setNavActive(!navActive)}/></span>
            :
            <span className='menu'><GrMenu onClick={() => setNavActive(!navActive)}/></span>
        }

        <div className={`message-container ${messageBox ? 'active' : ''}`}>
          <ReactScrollToBottom className='message-box'>
            {
              message.map((item, i) => {
                return <Message key={i} message={item.message} classs={item.id == userId ? 'right' : 'left'} user={item.id == userId ? '' : item.name}/>
              })
            }
            <div className='typing'>{type}</div>
          </ReactScrollToBottom>
          <form className='send-box' onSubmit={sendMessage}>
            <input type='text' placeholder='type something' ref={messageRef} autoComplete='off'/>
            <button type='submit'><BiSend/></button>
          </form>
        </div>


        <nav className='top_nav'>
              <button onClick={handleLayer}><BsFillLayersFill/></button>
            
            <button 
             id="rectangle"
             onClick={() => toolHandler("rectangle")}
            ><BsSquare/></button>

            <button
            id="circle"
             onClick={() => toolHandler("circle")}
            ><BsCircle/></button>
            <button
            id="selection"
            onClick={handlerSelect}
            ><AiOutlineSelect/></button>
            <button
            id="line" onClick={() => toolHandler('line')}
            ><HiOutlineMinus/></button>
            <button
            id="text" onClick={() => {setTextOpen(!textOpen); setStrokeActive(false);}}
            ><BiText/></button>
            {
               textOpen &&
              <div className='stroke_box flex_d_col textBox'>
                  <textarea placeholder='Add text' value={text} onChange={(e) => setText(e.target.value)}/>
                  <div>
                    <input type='text' placeholder='font size' value={font} onChange={(e) => setFont(e.target.value)}/>
                    <button onClick={addText}><BiAddToQueue/></button>
                  </div>  
              </div>
            }
            <button
            id="pencil"
            onClick={() => {handelPencil(); setStrokeActive(!strokeActive); setTextOpen(false)}}
            ><BsPencil/>
            </button>
            {
              strokeActive &&
              <div className='stroke_box flex_d_col'>
                  <label >
                    Stroke Width
                  </label>
                  <input type='text' placeholder='stroke width' list='size' value={strokeBoxSize} onChange={handleStroke}/>
                  <datalist id='size'>
                      {
                        sizeList.map((size,i) => <Fragment key={i}><option value={size}/></Fragment>)
                      }
                  </datalist>
              </div>
            }
            <button onClick={() => setColorBoxOpen(!colorBoxOpen)}><CgColorPicker/></button>
            {
              colorBoxOpen &&
              <div className='color_picker stroke_box'>
                <SketchPicker color={boxColor}  onChangeComplete={handleColor} defaultValue='#452135'/>
              </div>
            }
            <input type='file' style={{display: 'none'}} id='chooseFile' onChange={onUpload}/>
            <button><label htmlFor='chooseFile' ><RiGalleryFill/></label></button>
      </nav>
      <canvas
            id="canvas"
            ref={canvasRef}
            style={{overflow: 'auto'}}
          >
      </canvas>
      </div>

      <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          // theme="dark"
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
  </>);
}
export default FabricJSCanvas;