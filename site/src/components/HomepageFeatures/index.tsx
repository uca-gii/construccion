import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Un ejemplo, varios lenguajes',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Los ejemplos que ya se comparan en varios lenguajes (Java, C#, Scala...)
        se muestran con un selector de pestañas, sin duplicar la explicación.
      </>
    ),
  },
  {
    title: 'Edítalo y cópialo',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Todos los ejemplos son editables en la propia página y llevan un botón
        de copiar, para poder ejecutarlos también fuera del navegador.
      </>
    ),
  },
  {
    title: 'Ejecuta en el navegador',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Java, C#, JavaScript, Python y Ruby se ejecutan directamente en el
        navegador, sin servidor propio, gracias a runtimes WebAssembly.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
