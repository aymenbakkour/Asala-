
import { Product } from './types';

export const TELEGRAM_BOT_TOKEN = '8394320495:AAGyRY5siD2sQBbjL_JaoY1h6GH016TGBYM';
export const TELEGRAM_CHAT_ID = '1117141728';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'كبة مقلية',
    price: 1.5,
    description: 'كبة مقلية طازجة ومقرمشة محشوة باللحم والجوز.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Kibbeh3.jpg/330px-Kibbeh3.jpg'
  },
  {
    id: '2',
    name: 'كبة مشوية',
    price: 2.0,
    description: 'كبة مشوية على الفحم بنكهة فريدة ومميزة.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Kobbeh.png/330px-Kobbeh.png'
  },
  {
    id: '3',
    name: 'كبة لبنية',
    price: 1.0,
    description: 'كبة مطبوخة باللبن الرائب على الطريقة الشامية التقليدية.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/%D9%83%D8%A8%D8%A9_%D9%84%D8%A8%D9%86%D9%8A%D8%A9.jpg'
  },
  {
    id: '4',
    name: 'برك',
    price: 0.5,
    description: 'برك محشوة بالجبنة أو اللحم، مخبوزة أو مقلية حسب الطلب.',
    image: 'https://img-global.cpcdn.com/recipes/b9803885dea19901/680x482cq70/photo.jpg'
  }
];
