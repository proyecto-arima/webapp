// https://stackblitz.com/edit/markmap-react?file=src%2Fmain.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Markmap } from 'markmap-view';
import { transformer } from './markmap';
import { Toolbar } from 'markmap-toolbar';
import 'markmap-toolbar/dist/style.css';


function renderToolbar(mm: Markmap, wrapper: HTMLElement) {
  while (wrapper?.firstChild) wrapper.firstChild.remove();
  if (mm && wrapper) {
    const toolbar = new Toolbar();
    toolbar.attach(mm);
    // Register custom buttons
    toolbar.register({
      id: 'alert',
      title: 'Click to show an alert',
      content: 'Alert',
      onClick: () => alert('You made it!'),
    });
    toolbar.setItems([...Toolbar.defaultItems, 'alert']);
    wrapper.append(toolbar.render());
  }
}

type MarkmapHooksProps = {
  initValue: string;
};
 
export default function MarkmapHooks({ initValue }: MarkmapHooksProps) {
  const [value, setValue] = useState(initValue);
  // Ref for SVG element
  const refSvg = useRef<SVGSVGElement>();
  // Ref for markmap object
  const refMm = useRef<Markmap>();
  // Ref for toolbar wrapper
  const refToolbar = useRef<HTMLDivElement>();

  useEffect(() => {
    // Create markmap and save to refMm
    if (refMm.current || refSvg.current === undefined) return;
    if(refToolbar.current === undefined) return;
    const mm = Markmap.create(refSvg.current);
    console.log('create', refSvg.current);
    refMm.current = mm;
    renderToolbar(refMm.current, refToolbar.current);
  }, [refSvg.current]);

  useEffect(() => {
    // Update data for markmap once value is changed
    const mm = refMm.current;
    if (!mm) return;
    const { root } = transformer.transform(value);
    mm.setData(root);
    mm.fit();
  }, [refMm.current, value]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <React.Fragment>
      <div className="flex-1 w-100">
        <textarea
          className="w-100 h-full border border-gray-400"
          value={value}
          onChange={handleChange}
        />
      </div>
      <svg className="flex-1 flex-grow-1 w-100" ref={refSvg as React.RefObject<SVGSVGElement>} />
      <div className="absolute bottom-1 right-1" ref={refToolbar as React.RefObject<HTMLDivElement>}></div>
    </React.Fragment>
  );
}
