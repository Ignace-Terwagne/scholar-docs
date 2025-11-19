import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} Docs`}
      description="Gratis, niet-commerciële documentatie.">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <Heading as="h1" className="hero__title">
            {siteConfig.title} Docs
          </Heading>
          <p className="hero__subtitle">
            Gratis te gebruiken, niet-commercieel.
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--secondary button--lg"
              to="/docs/general">
              Bekijk alle documentatie
            </Link>
          </div>
        </div>
      </header>
      <main className="container margin-vert--lg">
  <section className="margin-top--md">
    <p>
      Hey!<br /><br />
      Als je deze documentatie gevonden hebt, hoop ik dat je er zeker iets aan hebt.
      Je zal voorlopig nog niet zoveel zien staan, maar geleidelijk aan zullen hier
      alle onderdelen van de cursussen <strong>Web Frameworks</strong> en <strong>Python</strong>
      in komen te staan.
    </p>
    <p>
      Deze documentatie biedt meer uitleg bij de verschillende onderdelen, en kan
      gebruikt worden als studiehulp.
    </p>
    <p>
      Merk je fouten op of heb je zelf dingen die je graag zou toevoegen? Open dan
      gerust een <a href="https://github.com/<jouw-repo>/issues">issue</a> en/of
      <a href="https://github.com/<jouw-repo>/pulls">pull request</a> op GitHub.
    </p>
  </section>
</main>

    </Layout>
  );
}