"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { setIsContextSet, updateString } from '../GlobalRedux/Features/string/stringSlice'
import learningSystemPrompt from '@/lib/learningSystemPrompt'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../GlobalRedux/store'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Dropdown, Menu } from 'antd'

type Props = {}   

const PDFFileHandler = (props: Props) => {
  const [selectedText, setSelectedText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const dispatch = useDispatch();
  const objectUrl = useSelector((state: RootState) => state.counter.file)
  const [state, setState] = useState("")
  const [loading, setloading] = useState(true)
  const finalUrl=useSelector((state:RootState)=>state.counter.file)
  // function removeHiddenData(text: string) {
  //   const pattern = /^hidden/;
  //   return text.replace(pattern, '');
  // }

  // const finalUrl = removeHiddenData(objectUrl)

/////////////////////////////////////////////////////////////////////
//follwing it the code for menu
  // const show = useSelector((state: RootState) => state.counter.value);
  // const pdf = useSelector((state: RootState) => state.counter.file);

  // const [isDragging, setIsDragging] = useState(false);
  // const [leftPannelWidth, setLeftPannelWidth] = useState(null);
  // const [leftPannel, setLeftPannel] = useState(null);
  // const [rightPannelWidth, setRightPannelWidth] = useState(null);
  // const [rightPannel, setRightPannel] = useState(null);
  // const [splitterX, setSplitterX] = useState(0);

  // const onMouseDown = (e) => {
  //   setIsDragging(true);
  //   let pEle = e.target.previousElementSibling;
  //   let nEle = e.target.nextElementSibling;

  //   setLeftPannel(pEle);
  //   setRightPannel(nEle);
  //   setLeftPannelWidth(pEle.offsetWidth);
  //   setRightPannelWidth(nEle.offsetWidth);
  //   setSplitterX(e.pageX);
  // };

  // const onMouseMove = (e) => {
  //   if (!isDragging) return;
  //   let mx = e.pageX - splitterX;
  //   try {
  //     leftPannel.style.width = (leftPannelWidth + mx) + 'px';
  //     rightPannel.style.width = (rightPannelWidth - mx) + 'px';
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const onMouseUp = (e) => {
  //   setIsDragging(false);
  // };

  // useEffect(() => {
  //   if (isDragging) {
  //     document.addEventListener('mousemove', onMouseMove);
  //     document.addEventListener('mouseup', onMouseUp);
  //   }
  //   return () => {
  //     document.removeEventListener('mousemove', onMouseMove);
  //     document.removeEventListener('mouseup', onMouseUp);
  //   };
  // }, [isDragging]);

  const handleSelection = (event) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString().trim();
      if (selectedText) {
        setSelectedText(selectedText);
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setMenuPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
        setMenuVisible(true);
      } else {
        setMenuVisible(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);

    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, []);

  const menu:any = (
    <Menu>
      <Menu.Item key="1" onClick={() => alert(`Action 1 on: ${selectedText}`)}>
        Explain term
      </Menu.Item>
      <Menu.Item key="2" onClick={() => alert(`Action 2 on: ${selectedText}`)}>
        Summarize term
      </Menu.Item>
    </Menu>
  );

  return (
    <div className='h-full'>
      {loading ? "loading" : (
        <div className='h-full'>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div style={{
        border: '1px solid rgba(0, 0, 0, 0.3)',
        height: '593px',
    }}>
              <Viewer
                defaultScale={1}
                theme={"dark"}
                fileUrl={finalUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </div>
            {menuVisible && (
              <Dropdown  menu={{items:menu}} visible={menuVisible} trigger={['click']}>
                <span
                  style={{
                    position: 'absolute',
                    top: menuPosition.y,
                    left: menuPosition.x,
                    visibility: 'hidden',
                    zIndex: 1
                  }}
                />
              </Dropdown>
            )}
          </Worker>
        </div>
      )}
    </div>
  )
}

export default PDFFileHandler