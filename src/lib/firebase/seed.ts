import { db } from '@/lib/firebase/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { products } from '@/data/products';

export const seedProducts = async () => {
  const productsCol = collection(db, 'products');
  const snapshot = await getDocs(productsCol);
  
  if (snapshot.empty) {
    console.log('Seeding products...');
    for (const product of products) {
      await setDoc(doc(db, 'products', product.slug), product);
    }
    console.log('Products seeded!');
  } else {
    console.log('Products already exist in Firestore.');
  }
};
