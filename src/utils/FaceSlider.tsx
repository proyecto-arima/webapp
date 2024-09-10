import './FaceSlider.css';
export interface IProps {
  answer: string;
  index: number;
  sliderValues: number[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function FaceSlider({ answer, index, sliderValues, onChange }: IProps) {
  <div style={{
    width: '100%',
  }}>
    <p>
      {answer}
    </p>
    <input type="range" min="0" max="3" value={sliderValues[index]} id={`range${sliderValues[index] + 1}`} step={1} onChange={onChange}
    
    />
  </div>
}