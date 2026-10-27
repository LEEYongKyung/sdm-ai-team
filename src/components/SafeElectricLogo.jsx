import { Component } from 'react';
import ElectricLogo from './ElectricLogo';

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
};

// WebGL을 못 쓰는 PC에서는 원본 로고 이미지로 대체한다
class Boundary extends Component {
  state = { failed: !hasWebGL() };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function SafeElectricLogo({ src, scale = 0.7, ...props }) {
  const fallback = (
    <div className="grid h-full w-full place-items-center">
      <img src={src} alt="" className="object-contain" style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }} />
    </div>
  );
  return (
    <Boundary fallback={fallback}>
      <ElectricLogo src={src} scale={scale} {...props} />
    </Boundary>
  );
}
