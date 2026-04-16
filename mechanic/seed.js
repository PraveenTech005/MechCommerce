import bike1 from './assets/images/bike1.jpg';
import bike2 from './assets/images/bike2.jpg';
import bike3 from './assets/images/bike3.jpg';
import bike4 from './assets/images/bike4.jpg';
import bike5 from './assets/images/bike5.jpg';
import bike6 from './assets/images/bike6.jpg';
import car1 from './assets/images/car1.jpg';
import car2 from './assets/images/car2.jpg';
import car3 from './assets/images/car3.jpg';
import car4 from './assets/images/car4.jpg';
import car5 from './assets/images/car5.jpg';
import car6 from './assets/images/car6.jpg';
import eng1 from './assets/images/eng1.jpg';
import eng2 from './assets/images/eng2.jpg';
import eng3 from './assets/images/eng3.jpg';
import eng4 from './assets/images/eng4.jpg';
import eng5 from './assets/images/eng5.jpg';
import eng6 from './assets/images/eng6.jpg';
import acc1 from './assets/images/acc1.jpg';
import acc2 from './assets/images/acc2.jpg';
import acc3 from './assets/images/acc3.jpg';
import acc4 from './assets/images/acc4.jpg';
import acc5 from './assets/images/acc5.jpg';
import acc6 from './assets/images/acc6.jpg';

const products = [
  // ── BIKE PARTS ──────────────────────────────────────────────────
  {
    id: 1,
    name: 'Brake Cable',
    category: 'bike',
    price: 499,
    image: bike1,
    description: 'High-tensile steel brake cable compatible with most sport and commuter bikes. Ensures sharp, responsive braking.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Yamaha', model: 'MT-15' },
      { name: 'Honda', model: 'CBR 150R' },
    ],
  },
  {
    id: 2,
    name: 'Drive Chain',
    category: 'bike',
    price: 899,
    image: bike2,
    description: 'O-ring sealed drive chain with anti-rust coating. Fits 428/520 pitch sprockets for smooth power transfer.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Yamaha', model: 'FZ-S V3' },
      { name: 'Bajaj', model: 'Pulsar NS200' },
    ],
  },
  {
    id: 3,
    name: 'Wing Mirror Set',
    category: 'bike',
    price: 299,
    image: bike3,
    description: 'Universal motorcycle wing mirror set with wide-angle convex glass. Easy bolt-on installation.',
    stock: true,
    vehicle: [
      { name: 'Honda', model: 'CB Shine' },
      { name: 'Hero', model: 'Splendor Plus' },
      { name: 'TVS', model: 'Apache RTR 160' },
    ],
  },
  {
    id: 4,
    name: 'Comfort Seat',
    category: 'bike',
    price: 1299,
    image: bike4,
    description: 'Ergonomically designed foam seat with weather-resistant vinyl cover. Reduces vibration fatigue on long rides.',
    stock: true,
    vehicle: [
      { name: 'Bajaj', model: 'Pulsar NS200' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
    ],
  },
  {
    id: 5,
    name: 'Handlebar Grip Set',
    category: 'bike',
    price: 699,
    image: bike5,
    description: 'Anti-vibration rubber handlebar grips with knurled pattern for secure control in all weather conditions.',
    stock: false,
    vehicle: [
      { name: 'Yamaha', model: 'MT-15' },
      { name: 'Yamaha', model: 'FZ-S V3' },
      { name: 'Honda', model: 'CB Shine' },
      { name: 'Hero', model: 'Splendor Plus' },
    ],
  },
  {
    id: 6,
    name: 'Full-face Helmet',
    category: 'bike',
    price: 1999,
    image: bike6,
    description: 'ISI-certified full-face helmet with aerodynamic shell, anti-scratch visor, and ventilation ducts.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Honda', model: 'CBR 150R' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
      { name: 'Bajaj', model: 'Pulsar NS200' },
    ],
  },

  // ── CAR PARTS ───────────────────────────────────────────────────
  {
    id: 7,
    name: 'Oil Filter',
    category: 'car',
    price: 699,
    image: car1,
    description: 'Premium spin-on oil filter with anti-drain back valve. Removes 99% of engine contaminants for longer engine life.',
    stock: true,
    vehicle: [
      { name: 'Maruti', model: 'Swift' },
      { name: 'Maruti', model: 'Baleno' },
      { name: 'Hyundai', model: 'i20' },
    ],
  },
  {
    id: 8,
    name: 'Ceramic Brake Pad',
    category: 'car',
    price: 1499,
    image: car2,
    description: 'Low-dust ceramic brake pads with chamfered and slotted design for reduced noise and fade resistance.',
    stock: true,
    vehicle: [
      { name: 'Hyundai', model: 'Creta' },
      { name: 'Kia', model: 'Seltos' },
      { name: 'Tata', model: 'Nexon' },
    ],
  },
  {
    id: 9,
    name: 'Wiper Blades',
    category: 'car',
    price: 399,
    image: car3,
    description: 'Frameless beam wiper blades for streak-free visibility. Fits standard J-hook and pin-type arms.',
    stock: true,
    vehicle: [
      { name: 'Maruti', model: 'Swift' },
      { name: 'Maruti', model: 'Baleno' },
      { name: 'Honda', model: 'City' },
      { name: 'Hyundai', model: 'i20' },
    ],
  },
  {
    id: 10,
    name: 'Leatherette Seat Cover',
    category: 'car',
    price: 2499,
    image: car4,
    description: 'Custom-fit leatherette seat cover set with contrast stitching. Water-resistant and easy to clean.',
    stock: true,
    vehicle: [
      { name: 'Hyundai', model: 'Creta' },
      { name: 'Kia', model: 'Seltos' },
      { name: 'Maruti', model: 'Swift' },
    ],
  },
  {
    id: 11,
    name: 'Car Battery 45Ah',
    category: 'car',
    price: 4999,
    image: car5,
    description: '45Ah maintenance-free SMF battery with superior cold-crank amps. Long service life of 48-60 months.',
    stock: true,
    vehicle: [
      { name: 'Maruti', model: 'Swift' },
      { name: 'Maruti', model: 'Baleno' },
      { name: 'Honda', model: 'City' },
      { name: 'Hyundai', model: 'i20' },
      { name: 'Tata', model: 'Nexon' },
    ],
  },
  {
    id: 12,
    name: 'Dual-tone Car Horn',
    category: 'car',
    price: 599,
    image: car6,
    description: 'High/low dual-tone electromagnetic horn. 120dB output, 12V, corrosion-resistant body.',
    stock: false,
    vehicle: [
      { name: 'Honda', model: 'City' },
      { name: 'Hyundai', model: 'i20' },
      { name: 'Hyundai', model: 'Creta' },
      { name: 'Tata', model: 'Nexon' },
    ],
  },

  // ── ENGINE PARTS ────────────────────────────────────────────────
  {
    id: 13,
    name: 'Iridium Spark Plug',
    category: 'engine',
    price: 299,
    image: eng1,
    description: 'Iridium-tipped spark plug for faster ignition, enhanced throttle response, and 20% better fuel economy.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Honda', model: 'CBR 150R' },
      { name: 'Maruti', model: 'Swift' },
      { name: 'Honda', model: 'City' },
    ],
  },
  {
    id: 14,
    name: 'Forged Piston Kit',
    category: 'engine',
    price: 2499,
    image: eng2,
    description: 'High-compression forged aluminium piston kit with rings and wrist pin. STD bore size for direct fit.',
    stock: true,
    vehicle: [
      { name: 'KTM', model: 'Duke 200' },
      { name: 'Bajaj', model: 'Pulsar NS200' },
    ],
  },
  {
    id: 15,
    name: 'Clutch Plate Set',
    category: 'engine',
    price: 1899,
    image: eng3,
    description: 'OEM-grade multi-friction clutch plate set. Reduces slip and ensures smooth gear engagement.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'MT-15' },
      { name: 'Yamaha', model: 'FZ-S V3' },
      { name: 'Honda', model: 'CB Shine' },
      { name: 'Bajaj', model: 'Pulsar NS200' },
    ],
  },
  {
    id: 16,
    name: 'Crankshaft Assembly',
    category: 'engine',
    price: 4599,
    image: eng4,
    description: 'Precision-balanced crankshaft assembly with main bearings. Reduces vibration and improves longevity.',
    stock: false,
    vehicle: [
      { name: 'Hero', model: 'Splendor Plus' },
      { name: 'Honda', model: 'CB Shine' },
    ],
  },
  {
    id: 17,
    name: 'Cylinder Bore Kit',
    category: 'engine',
    price: 5299,
    image: eng5,
    description: 'Complete cylinder bore kit with honed finish. Ready to install with matching piston, rings, and gaskets.',
    stock: true,
    vehicle: [
      { name: 'Bajaj', model: 'Pulsar NS200' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
    ],
  },
  {
    id: 18,
    name: 'Synthetic Engine Oil 1L',
    category: 'engine',
    price: 999,
    image: eng6,
    description: 'Full-synthetic 10W-40 engine oil for four-stroke engines. API SL rated, reduces wear by up to 40%.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Yamaha', model: 'MT-15' },
      { name: 'Yamaha', model: 'FZ-S V3' },
      { name: 'Honda', model: 'CBR 150R' },
      { name: 'Honda', model: 'CB Shine' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
      { name: 'Bajaj', model: 'Pulsar NS200' },
      { name: 'Hero', model: 'Splendor Plus' },
      { name: 'TVS', model: 'Apache RTR 160' },
    ],
  },

  // ── ACCESSORIES ─────────────────────────────────────────────────
  {
    id: 19,
    name: 'ISI Open-face Helmet',
    category: 'accessories',
    price: 1499,
    image: acc1,
    description: 'ISI-certified open-face helmet with anti-UV visor and quick-release chin strap. Lightweight ABS shell.',
    stock: true,
    vehicle: [
      { name: 'Hero', model: 'Splendor Plus' },
      { name: 'TVS', model: 'Apache RTR 160' },
      { name: 'Honda', model: 'CB Shine' },
    ],
  },
  {
    id: 20,
    name: 'Riding Gloves',
    category: 'accessories',
    price: 499,
    image: acc2,
    description: 'Mesh riding gloves with knuckle protection and palm slider. Ventilated for all-season comfort.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
      { name: 'Honda', model: 'CBR 150R' },
    ],
  },
  {
    id: 21,
    name: 'Phone Mount Holder',
    category: 'accessories',
    price: 399,
    image: acc3,
    description: 'Universal handlebar phone mount with 360° rotation. Fits phones 4"–7". Vibration-dampening silicone arms.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Yamaha', model: 'MT-15' },
      { name: 'Yamaha', model: 'FZ-S V3' },
      { name: 'Honda', model: 'CBR 150R' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
      { name: 'Bajaj', model: 'Pulsar NS200' },
      { name: 'TVS', model: 'Apache RTR 160' },
    ],
  },
  {
    id: 22,
    name: 'Neoprene Seat Cover',
    category: 'accessories',
    price: 899,
    image: acc4,
    description: 'Waterproof neoprene bike seat cover with anti-slip base. UV-stabilized to prevent fading.',
    stock: false,
    vehicle: [
      { name: 'Hero', model: 'Splendor Plus' },
      { name: 'Honda', model: 'CB Shine' },
      { name: 'TVS', model: 'Apache RTR 160' },
    ],
  },
  {
    id: 23,
    name: 'Bike Body Cover',
    category: 'accessories',
    price: 699,
    image: acc5,
    description: 'Silver heat-reflective dust cover with soft inner lining. Elastic hem for secure fit. All-weather protection.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Yamaha', model: 'MT-15' },
      { name: 'Yamaha', model: 'FZ-S V3' },
      { name: 'Honda', model: 'CBR 150R' },
      { name: 'Honda', model: 'CB Shine' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
      { name: 'Bajaj', model: 'Pulsar NS200' },
      { name: 'Hero', model: 'Splendor Plus' },
      { name: 'TVS', model: 'Apache RTR 160' },
    ],
  },
  {
    id: 24,
    name: 'Premium Keychain',
    category: 'accessories',
    price: 199,
    image: acc6,
    description: 'Metal alloy keychain with brand emblem. Corrosion-resistant chrome finish.',
    stock: true,
    vehicle: [
      { name: 'Yamaha', model: 'R15 V3' },
      { name: 'Yamaha', model: 'MT-15' },
      { name: 'KTM', model: 'Duke 200' },
      { name: 'KTM', model: 'Duke 390' },
      { name: 'Honda', model: 'CBR 150R' },
    ],
  },
];

// Derived vehicle catalog from products
export const vehicleCatalog = {
  Yamaha: ['R15 V3', 'MT-15', 'FZ-S V3'],
  Honda: ['CBR 150R', 'CB Shine', 'City'],
  KTM: ['Duke 200', 'Duke 390'],
  Bajaj: ['Pulsar NS200'],
  Hero: ['Splendor Plus'],
  TVS: ['Apache RTR 160'],
  Maruti: ['Swift', 'Baleno'],
  Hyundai: ['i20', 'Creta'],
  Kia: ['Seltos'],
  Tata: ['Nexon'],
};

export default products;
