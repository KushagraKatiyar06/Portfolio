import './UI.css'

export default function UI({
  cars,
  selectedCarId,
  onSelectCar,
  transform,
  onUpdateTransform,
  onResetTransform,
  showAxes,
  onToggleAxes,
  posRange = 50,
  scaleMax = 5,
}) {
  const { px, py, pz, ry, scale } = transform
  const posStep = Math.max(0.001, posRange / 500)
  const scaleStep = Math.max(0.0001, scaleMax / 500)

  return (
    <div className="ui-panel">
      <div className="section">
        <div className="section-label">Vehicle</div>
        <div className="car-buttons">
          {cars.map(car => (
            <button
              key={car.id}
              className={car.id === selectedCarId ? 'active' : ''}
              onClick={() => onSelectCar(car.id)}
            >
              {car.name}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-label">Position</div>
        <SliderRow label="X" value={px} min={-posRange} max={posRange} step={posStep} k="px" onChange={onUpdateTransform} />
        <SliderRow label="Y" value={py} min={-posRange * 0.5} max={posRange * 0.5} step={posStep} k="py" onChange={onUpdateTransform} />
        <SliderRow label="Z" value={pz} min={-posRange} max={posRange} step={posStep} k="pz" onChange={onUpdateTransform} />
      </div>

      <div className="section">
        <div className="section-label">Rotation Y</div>
        <SliderRow label="°" value={ry} min={-180} max={180} step={1} k="ry" onChange={onUpdateTransform} />
      </div>

      <div className="section">
        <div className="section-label">Scale</div>
        <SliderRow label="S" value={scale} min={scaleStep} max={scaleMax} step={scaleStep} k="scale" onChange={onUpdateTransform} />
      </div>

      <div className="actions">
        <button className="action-btn" onClick={onResetTransform}>Reset</button>
        <button className={`action-btn ${showAxes ? 'active' : ''}`} onClick={onToggleAxes}>
          Axes
        </button>
      </div>

      <div className="coords">
        ({px.toFixed(2)}, {py.toFixed(2)}, {pz.toFixed(2)}) &nbsp; {ry}° &nbsp; ×{scale.toFixed(4)}
      </div>
    </div>
  )
}

function SliderRow({ label, value, min, max, step, k, onChange }) {
  return (
    <div className="slider-row">
      <span className="slider-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(k, e.target.value)}
      />
      <span className="slider-value">{typeof value === 'number' ? value.toFixed(2) : value}</span>
    </div>
  )
}
