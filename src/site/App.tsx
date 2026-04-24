import { useState } from 'react';
import { NeoProvider } from '../lib';
import type { NeoTheme } from '../lib';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { ThemesExplain } from './sections/ThemesExplain';
import { ButtonShowcase } from './sections/ButtonShowcase';
import { InputShowcase } from './sections/InputShowcase';
import { CardShowcase } from './sections/CardShowcase';
import { BYOTheme } from './sections/BYOTheme';
import { QuickStart } from './sections/QuickStart';
import { Footer } from './sections/Footer';
import './site.css';

export function App() {
  const [theme, setTheme] = useState<NeoTheme>('classic');
  return (
    <NeoProvider theme={theme} className="site-root">
      <Nav current={theme} onChange={setTheme} />
      <main className="site-main">
        <Hero />
        <ThemesExplain />
        <ButtonShowcase />
        <InputShowcase />
        <CardShowcase />
        <BYOTheme />
        <QuickStart />
      </main>
      <Footer />
    </NeoProvider>
  );
}
