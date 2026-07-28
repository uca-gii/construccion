import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkRunnableCodeBlocks from './src/remark/runnable-code-blocks.mjs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Apuntes de Implementación de Sistemas Software',
  tagline:
    'Programación con objetos, delegación, contratos, errores, aspectos y más — con ejemplos editables y ejecutables',
  favicon: 'img/favicon.ico',

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Final URL once published by dodero.github.io's "custom" builder entry
  // "construccion-implementacion-notas" (source slug "notas").
  url: 'https://dodero.github.io',
  baseUrl: '/materials/construccion-implementacion-notas/notas/',

  organizationName: 'uca-gii',
  projectName: 'construccion',

  onBrokenLinks: 'throw',

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+',
      crossorigin: 'anonymous',
    },
  ],

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          path: '../docs',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          beforeDefaultRemarkPlugins: [remarkRunnableCodeBlocks],
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          editUrl:
            'https://github.com/uca-gii/construccion/tree/master/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Implementación de Sistemas Software',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'implementacionSidebar',
          position: 'left',
          label: 'Apuntes',
        },
        {
          href: 'https://github.com/uca-gii/construccion',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Apuntes',
          items: [
            {
              label: 'Programación con objetos',
              to: '/implementacion/oop',
            },
          ],
        },
        {
          title: 'Curso',
          items: [
            {
              label: 'Slides (Marp)',
              href: 'https://github.com/uca-gii/construccion/tree/master/slides/implementacion',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Juan Manuel Dodero. Construido con Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'csharp', 'ruby', 'scala', 'cpp', 'c'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
