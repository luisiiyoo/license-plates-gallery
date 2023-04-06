import mexicoFlag from './flags/mexico.png';
import usFlag from './flags/united-states.png';

interface languageType {
  languageCode: string;
  name: string;
  flag: string;
}

export const languages: languageType[] = [
  { languageCode: 'es', name: 'Español', flag: mexicoFlag },
  { languageCode: 'en', name: 'English', flag: usFlag },
];

export const translations = {
  en: {
    NavBar: {
      'license-plates-gallery': 'Home',
      collection: 'Collection',
    },
    LanguageSwitcher: {
      label: 'Language',
    },
    HomePage: {
      title: 'Virtual License Plates Gallery',
      body: {
        p1: 'Welcome to my personal License Plates Gallery.',
        p2:
          "In this website I mix two of my hobbies, developing apps and collecting license plates. This website is still in progress, keep visiting this page I'm constantly adding new things.",
        author: 'Author',
      },
    },
  },
  es: {
    NavBar: {
      'license-plates-gallery': 'Inicio',
      collection: 'Colección',
    },
    LanguageSwitcher: {
      label: 'Idioma',
    },
    HomePage: {
      title: 'Galería Virtual de Placas',
      body: {
        p1: 'Bienvenidos a mi Galería de Placas.',
        p2:
          'En esta pagina web combino mis dos pasatiempos, desarrollar aplicaciones web y coleccionar placas de auto. Éste sitio aun esta en proceso de desarrollo, te invito a seguir visitandolo, sigo agregando nuevas cosas.',
        author: 'Autor',
      },
    },
  },
};

export const getTranslation = (
  languageCode: string,
  elementName: string,
): string | Map<string, any> => {
  return translations[languageCode][elementName];
};