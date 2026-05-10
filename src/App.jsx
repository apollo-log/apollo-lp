import { useT } from './i18n/I18nProvider.jsx';
import { useReveal } from './hooks/useReveal.js';
import { useScrollDepth } from './hooks/useScrollDepth.js';
import { track } from './lib/analytics.js';
import { CustomCursor } from './components/CustomCursor.jsx';
import { Counter } from './components/Counter.jsx';
import { TelemetryChart } from './components/TelemetryChart.jsx';
import { EventFeed } from './components/EventFeed.jsx';
import { TheftViz } from './components/TheftViz.jsx';
import { PredictiveGraph } from './components/PredictiveGraph.jsx';
import { Sparkbars } from './components/Sparkbars.jsx';
import { BrainGrid } from './components/BrainGrid.jsx';
import { Hero3D } from './components/Hero3D.jsx';
import { Waitlist } from './components/Waitlist.jsx';
import { LanguageToggle } from './components/LanguageToggle.jsx';
import { RotatingHeadline } from './components/RotatingHeadline.jsx';

export default function App() {
  const t = useT();
  useReveal();
  useScrollDepth();

  const onCta = (location) => () => track('cta_click', { location });

  return (
    <>
      <CustomCursor />

      {/* NAV */}
      <nav className="nav">
        <a href="#top" className="nav-brand">
          <img src="/assets/apollo-logo.png" alt="Apollo" />
          <span>Apollo</span>
        </a>
        <div className="nav-links">
          <a href="#telemetry">{t('nav.platform')}</a>
          <a href="#how">{t('nav.how')}</a>
          <a href="#theft">{t('nav.diesel')}</a>
          <a href="#predictive">{t('nav.predict')}</a>
          <a href="#pricing">{t('nav.pricing')}</a>
        </div>
        <div className="nav-right">
          <LanguageToggle />
          <a href="#waitlist" className="nav-cta" onClick={onCta('nav')}>{t('nav.cta')}</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero-grid-bg"></div>
        <div className="shell">
          <div className="hero-meta">
            <div className="hero-meta-cell"><span className="live-dot"></span> {t('hero.metaLive')}</div>
            <div className="hero-meta-cell">{t('hero.metaCoord')}</div>
            <div className="hero-meta-cell">{t('hero.metaVersion')}</div>
          </div>

          <div className="hero-stage">
            <div className="hero-headline">
              <div className="eyebrow"><span className="dot"></span>{t('hero.eyebrow')}</div>
              <h1 className="hero-h1">
                <span className="hero-h1-brand">{t('hero.brand')}</span>
                <RotatingHeadline phrases={t('hero.headlines')} className="hero-h1-rotate" />
              </h1>
              <p className="hero-tagline">{t('hero.tagline')}</p>
              <div className="hero-actions">
                <a href="#waitlist" className="btn btn-primary" onClick={onCta('hero_primary')}>{t('hero.ctaPrimary')} <span className="arrow">→</span></a>
                <a href="#how" className="btn btn-ghost" onClick={onCta('hero_secondary')}>{t('hero.ctaSecondary')}</a>
              </div>
            </div>

            <div className="hero-canvas-wrap">
              <Hero3D />
              <div className="hero-canvas-frame">
                <div className="corner tl"></div>
                <div className="corner tr"></div>
                <div className="corner bl"></div>
                <div className="corner br"></div>
              </div>
              <div className="hero-readout tl">{t('hero.readouts.sys')}<br /><span className="val">{t('hero.readouts.sysVal')}</span></div>
              <div className="hero-readout tr">{t('hero.readouts.uplink')}<br /><span className="val">{t('hero.readouts.uplinkVal')}</span></div>
              <div className="hero-readout bl">{t('hero.readouts.pkt')}<br /><span className="val">{t('hero.readouts.pktVal')}</span></div>
              <div className="hero-readout br">{t('hero.readouts.anom')}<br /><span className="val">{t('hero.readouts.anomVal')}</span></div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="ticker">
          <div className="ticker-track">
            {[...Array(2)].map((_, k) => (
              <span key={k} style={{ display: 'inline-flex', gap: 48 }}>
                <span><span className="sep"></span> {t('hero.ticker.a')}</span>
                <span className="gold">{t('hero.ticker.b')}</span>
                <span><span className="sep"></span> {t('hero.ticker.c')}</span>
                <span className="gold">{t('hero.ticker.d')}</span>
                <span><span className="sep"></span> {t('hero.ticker.e')}</span>
                <span className="gold">{t('hero.ticker.f')}</span>
                <span><span className="sep"></span> {t('hero.ticker.g')}</span>
                <span className="gold">{t('hero.ticker.h')}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE TELEMETRY */}
      <section className="telemetry" id="telemetry">
        <div className="shell">
          <div className="section-head">
            <div className="index">
              <span className="num">01</span>
              {t('telemetry.indexLabel')}
            </div>
            <h2 className="display-l reveal-up">
              {t('telemetry.headlinePre')} <span style={{ color: 'var(--gold)' }}>{t('telemetry.headlineGold')}</span> {t('telemetry.headlinePost')}
            </h2>
          </div>

          <div className="telemetry-grid">
            <div className="panel">
              <div className="panel-head">
                <span className="title">{t('telemetry.panelPulseTitle')}</span>
                <span className="status">
                  <span className="live-dot" style={{ width: 8, height: 8, background: 'var(--gold)', borderRadius: '50%' }}></span> {t('telemetry.panelPulseStatus')}
                </span>
              </div>
              <div className="panel-body">
                <div className="chart-wrap">
                  <TelemetryChart />
                </div>
                <div className="telemetry-stat" style={{ marginTop: 20 }}>
                  <div className="cell"><div className="label">{t('telemetry.stats.rpm')}</div><div className="value">2,140</div><div className="delta">{t('telemetry.stats.rpmDelta')}</div></div>
                  <div className="cell"><div className="label">{t('telemetry.stats.fuel')}</div><div className="value">14.2 L/h</div><div className="delta">{t('telemetry.stats.fuelDelta')}</div></div>
                  <div className="cell"><div className="label">{t('telemetry.stats.coolant')}</div><div className="value">88°C</div><div className="delta bad">{t('telemetry.stats.coolantDelta')}</div></div>
                  <div className="cell"><div className="label">{t('telemetry.stats.battery')}</div><div className="value">13.8 V</div><div className="delta">{t('telemetry.stats.batteryDelta')}</div></div>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-head">
                <span className="title">{t('telemetry.panelEventsTitle')}</span>
                <span className="status">{t('telemetry.panelEventsStatus')}</span>
              </div>
              <EventFeed />
            </div>
          </div>

          <div className="numbers-strip">
            <div className="num-cell"><div className="v"><Counter to={142} /></div><div className="l">{t('telemetry.numbers.vehicles')}</div></div>
            <div className="num-cell"><div className="v"><Counter to={2418} /></div><div className="l">{t('telemetry.numbers.packets')}</div></div>
            <div className="num-cell"><div className="v"><Counter to={37} suffix="%" /></div><div className="l">{t('telemetry.numbers.reduction')}</div></div>
            <div className="num-cell"><div className="v"><Counter to={9} /></div><div className="l">{t('telemetry.numbers.detect')}</div></div>
          </div>

          <InlineCta href="#waitlist" label={t('telemetry.cta')} onClick={onCta('inline_telemetry')} />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {[...Array(2)].map((_, k) => (
            <span key={k} style={{ display: 'inline-flex', gap: 64 }}>
              <span>{t('marquee.a')}</span>
              <span className="star"></span>
              <span className="gold">{t('marquee.b')}</span>
              <span className="star"></span>
              <span className="out">{t('marquee.c')}</span>
              <span className="star"></span>
              <span>{t('marquee.d')}</span>
              <span className="star"></span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how" id="how">
        <div className="shell">
          <div className="section-head">
            <div className="index"><span className="num">02</span>{t('how.indexLabel')}</div>
            <h2 className="display-l reveal-up">{t('how.headline')}</h2>
          </div>
          <div className="how-grid">
            <div className="how-step">
              <div className="num">01</div>
              <h3>{t('how.s1Title')}</h3>
              <p>{t('how.s1Body')}</p>
              <div className="visual">
                <div className="pipe">
                  <div className="node">OBD</div>
                  <div className="line"></div>
                  <div className="node">CAN</div>
                  <div className="line"></div>
                  <div className="node gold">API</div>
                </div>
              </div>
            </div>
            <div className="how-step">
              <div className="num">02</div>
              <h3>{t('how.s2Title')}</h3>
              <p>{t('how.s2Body')}</p>
              <div className="visual">
                <Sparkbars />
              </div>
            </div>
            <div className="how-step">
              <div className="num">03</div>
              <h3>{t('how.s3Title')}</h3>
              <p dangerouslySetInnerHTML={{ __html: t('how.s3Body') }} />
              <div className="visual">
                <BrainGrid />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIESEL THEFT */}
      <section className="theft" id="theft">
        <div className="shell">
          <div className="section-head">
            <div className="index"><span className="num">03</span>{t('theft.indexLabel')}</div>
            <h2 className="display-l reveal-up">{t('theft.headline')}</h2>
          </div>
          <div className="theft-card">
            <div className="theft-copy">
              <span className="tag">{t('theft.tag')}</span>
              <h3>{t('theft.h3')}</h3>
              <p>{t('theft.body')}</p>
              <ul>
                <li>{t('theft.listA')}</li>
                <li>{t('theft.listB')}</li>
                <li>{t('theft.listC')}</li>
                <li>{t('theft.listD')}</li>
              </ul>
            </div>
            <div className="theft-viz">
              <TheftViz />
            </div>
          </div>

          <InlineCta href="#waitlist" label={t('theft.cta')} onClick={onCta('inline_theft')} />
        </div>
      </section>

      {/* PREDICTIVE ML */}
      <section className="predictive" id="predictive">
        <div className="shell">
          <div className="section-head">
            <div className="index"><span className="num">04</span>{t('predictive.indexLabel')}</div>
            <h2 className="display-l reveal-up">{t('predictive.headline')}</h2>
          </div>
          <div className="predictive-hero">
            <div className="predictive-stamp">{t('predictive.stamp')}</div>
            <div className="predictive-copy">
              <h3>
                {t('predictive.h3Pre')} <span className="strike">{t('predictive.h3Strike')}</span><br />
                {t('predictive.h3Mid')}<br />
                {t('predictive.h3Post')} <span style={{ color: 'var(--gold)' }}>{t('predictive.h3Gold')}</span> {t('predictive.h3End')}
              </h3>
              <p>{t('predictive.body')}</p>
            </div>
            <div className="predictive-graph">
              <PredictiveGraph />
            </div>
          </div>

          <InlineCta href="#waitlist" label={t('predictive.cta')} onClick={onCta('inline_predictive')} />
        </div>
      </section>

      {/* TRUST */}
      <section className="trust">
        <div className="shell">
          <div className="trust-head">
            <h2 className="display-m reveal-up">{t('trust.headline')}</h2>
            <p>{t('trust.sub')}</p>
          </div>
          <div className="trust-grid">
            {['lgpd', 'onprem', 'api', 'support'].map((k) => (
              <div className="trust-badge" key={k}>
                <div className="trust-badge-mark"></div>
                <h4>{t(`trust.badges.${k}.title`)}</h4>
                <p>{t(`trust.badges.${k}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / WAITLIST */}
      <section className="pricing" id="pricing">
        <div className="shell">
          <div className="section-head" style={{ borderBottomColor: 'var(--line)' }}>
            <div className="index"><span className="num">05</span>{t('pricing.indexLabel')}</div>
            <h2 className="display-l reveal-up">{t('pricing.headline')}</h2>
          </div>
          <div className="pricing-grid">
            <div className="tier">
              <div className="tier-name">{t('pricing.tiers.scout.name')}</div>
              <div className="tier-price">{t('pricing.tiers.scout.price')}<span className="sub">{t('pricing.tiers.scout.priceSub')}</span></div>
              <div className="tier-desc">{t('pricing.tiers.scout.desc')}</div>
              <ul>
                <li>{t('pricing.tiers.scout.f1')}</li>
                <li>{t('pricing.tiers.scout.f2')}</li>
                <li>{t('pricing.tiers.scout.f3')}</li>
                <li>{t('pricing.tiers.scout.f4')}</li>
                <li>{t('pricing.tiers.scout.f5')}</li>
              </ul>
              <a href="#waitlist" className="btn btn-ghost" onClick={onCta('pricing_scout')}>{t('pricing.tiers.scout.cta')}</a>
            </div>
            <div className="tier featured">
              <div className="tier-flag">{t('pricing.tiers.pathfinder.flag')}</div>
              <div className="tier-name">{t('pricing.tiers.pathfinder.name')}</div>
              <div className="tier-price">{t('pricing.tiers.pathfinder.price')}<span className="sub">{t('pricing.tiers.pathfinder.priceSub')}</span></div>
              <div className="tier-desc">{t('pricing.tiers.pathfinder.desc')}</div>
              <ul>
                <li>{t('pricing.tiers.pathfinder.f1')}</li>
                <li>{t('pricing.tiers.pathfinder.f2')}</li>
                <li>{t('pricing.tiers.pathfinder.f3')}</li>
                <li>{t('pricing.tiers.pathfinder.f4')}</li>
                <li>{t('pricing.tiers.pathfinder.f5')}</li>
                <li>{t('pricing.tiers.pathfinder.f6')}</li>
              </ul>
              <a href="#waitlist" className="btn btn-ghost" style={{ borderColor: 'var(--bg)', color: 'var(--bg)' }} onClick={onCta('pricing_pathfinder')}>{t('pricing.tiers.pathfinder.cta')}</a>
            </div>
            <div className="tier">
              <div className="tier-name">{t('pricing.tiers.cosmos.name')}</div>
              <div className="tier-price">{t('pricing.tiers.cosmos.price')}<span className="sub">{t('pricing.tiers.cosmos.priceSub')}</span></div>
              <div className="tier-desc">{t('pricing.tiers.cosmos.desc')}</div>
              <ul>
                <li>{t('pricing.tiers.cosmos.f1')}</li>
                <li>{t('pricing.tiers.cosmos.f2')}</li>
                <li>{t('pricing.tiers.cosmos.f3')}</li>
                <li>{t('pricing.tiers.cosmos.f4')}</li>
                <li>{t('pricing.tiers.cosmos.f5')}</li>
              </ul>
              <a href="#waitlist" className="btn btn-ghost" onClick={onCta('pricing_cosmos')}>{t('pricing.tiers.cosmos.cta')}</a>
            </div>
          </div>

          <div className="waitlist" id="waitlist">
            <div>
              <div className="eyebrow"><span className="dot"></span>{t('waitlist.eyebrow')}</div>
              <h3 style={{ marginTop: 16 }}>
                {t('waitlist.headlinePre')} <span className="gold">{t('waitlist.headlineGold')}</span>{t('waitlist.headlinePost')}
              </h3>
              <p>{t('waitlist.body')}</p>
            </div>
            <Waitlist />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="shell">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="footer-logo">
                <img src="/assets/apollo-logo.png" alt="Apollo" />
                <span>Apollo</span>
              </a>
              <p className="footer-tagline">{t('footer.tagline')}</p>
              <a href="#waitlist" className="btn btn-primary footer-cta" onClick={onCta('footer')}>
                {t('footer.cta')} <span className="arrow">→</span>
              </a>
            </div>

            <nav className="footer-cols">
              <div>
                <h4>{t('footer.colPlatform')}</h4>
                <ul>
                  <li><a href="#telemetry">{t('footer.links.telemetry')}</a></li>
                  <li><a href="#theft">{t('footer.links.diesel')}</a></li>
                  <li><a href="#predictive">{t('footer.links.predictive')}</a></li>
                  <li><a href="#how">{t('footer.links.how')}</a></li>
                  <li><a href="#pricing">{t('footer.links.pricing')}</a></li>
                </ul>
              </div>
              <div>
                <h4>{t('footer.colCompany')}</h4>
                <ul>
                  <li><a href="#">{t('footer.links.manifesto')}</a></li>
                  <li><a href="#">{t('footer.links.security')}</a></li>
                  <li><a href="#">{t('footer.links.careers')}</a></li>
                  <li><a href="#">{t('footer.links.press')}</a></li>
                </ul>
              </div>
              <div>
                <h4>{t('footer.colContact')}</h4>
                <ul>
                  <li><a href="mailto:hello@apollo.log">hello@apollo.log</a></li>
                  <li><a href="#">{t('footer.links.sales')}</a></li>
                  <li>{t('footer.links.location')}</li>
                  <li>{t('footer.links.coords')}</li>
                </ul>
              </div>
            </nav>
          </div>

          <div className="footer-mark">
            <span className="word">Apollo</span>
            <span className="footer-star" aria-hidden="true"></span>
          </div>

          <div className="footer-bottom">
            <div className="footer-status">
              <span className="status-dot" aria-hidden="true"></span>
              <span>{t('footer.status')}</span>
            </div>
            <div>{t('footer.copyright')}</div>
            <div className="links">
              <a href="#">{t('footer.legal.privacy')}</a>
              <a href="#">{t('footer.legal.terms')}</a>
              <a href="#">{t('footer.legal.status')}</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function InlineCta({ href, label, onClick }) {
  return (
    <a href={href} className="inline-cta" onClick={onClick}>
      <span>{label}</span>
    </a>
  );
}
