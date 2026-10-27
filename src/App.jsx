import { useEffect } from 'react';
import { ScrollTrigger, startSmoothScroll } from './lib/motion';
import { RequestProvider } from './components/RequestModal';
import Header from './sections/Header';
import Hero from './sections/Hero';
import Cases from './sections/Cases';
import Why from './sections/Why';
import Services from './sections/Services';
import Process from './sections/Process';
import Departments from './sections/Departments';
import Faq from './sections/Faq';
import Footer from './sections/Footer';

export default function App() {
  useEffect(() => {
    const stop = startSmoothScroll();
    // 폰트·이미지가 다 들어온 뒤 스크롤 위치 계산을 다시 한다
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      window.removeEventListener('load', refresh);
      stop();
    };
  }, []);

  return (
    <RequestProvider>
      <Header />
      <main>
        <Hero />
        <Cases />
        <Why />
        <Services />
        <Process />
        <Departments />
        <Faq />
      </main>
      <Footer />
    </RequestProvider>
  );
}
