// https://stackblitz.com/edit/markmap-react?file=src%2Fmain.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';
import { Card, CardTitle } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';


function renderToolbar(mm: Markmap, wrapper: HTMLElement, goToSummary: () => void) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    // Register custom buttons
    toolbar.register({
      id: 'alert',
      title: 'Click to show an alert',
      content: 'Ver Resumen',
      onClick: () => goToSummary(),
    });
    toolbar.setItems([...Toolbar.defaultItems, 'alert']);
    wrapper.append(toolbar.render());
  }
}

type MarkmapHooksProps = {
  text: string;
  editable: boolean;
  onChange: (text: string) => void;
};

export default function MarkmapHooks({ text, editable, onChange }: MarkmapHooksProps) {
  
  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement>();
  // Ref for markmap object
  const refMm = useRef<Markmap>();
  // Ref for toolbar wrapper
  const refToolbar = useRef<HTMLDivElement>();

  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    // Create markmap and save to refMm
    if (refMm.current || refSvg.current === undefined) return;
    const mm = Markmap.create(refSvg.current);
    console.log('create', refSvg.current);
    refMm.current = mm;
    if (refToolbar.current === undefined) return;
    renderToolbar(refMm.current, refToolbar.current, () => {
      navigate(`${location.pathname.replace('map', 'summary')}`);
    });
  }, [refSvg.current]);

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(`${text}`);
    mm.setData(root);
    mm.fit();
  }, [refMm.current, text]);

  const handleChange = (e: any) => {
    onChange(e.target.value);
  };

  const buildMarkmap = () => <>
    <svg className="flex-1 flex-grow-1 w-100 h-100" ref={refSvg as React.RefObject<SVGSVGElement>} />
    {/* <div className="absolute bottom-1" ref={refToolbar as React.RefObject<HTMLDivElement>}></div> */}
  </>

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      gap: '1rem',
    }}>
      <Card className="w-100 p-3" style={{
        display: editable ? 'flex' : 'none',
      }}>
        <h3>Definición del Mapa Mental</h3>
        <hr />
        <textarea
          className="w-100 generated-content"
          value={text}
          onChange={handleChange}
          style={{
            resize: 'none',
            border: '0',
            outline: 'none',
            borderColor: 'transparent',
            overflowY: 'scroll',
            
            fontSize: '0.9rem',
            flex: '1',
            textWrap: 'nowrap',
            overflowX: 'scroll',
            scrollbarWidth: 'thin',
          }}
        />
      </Card>
      {editable ? <Card className="flex-1 flex-grow-1 w-100 h-100 p-3">
          <h3>Mapa Mental</h3>
          <hr />
          {buildMarkmap()}
      </Card> : <div className='flex-1 flex-grow-1 w-100 h-100 p-3'>{buildMarkmap()}</div>}
    </div>
  );
}
