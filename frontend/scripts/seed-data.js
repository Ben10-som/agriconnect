import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPJZfZjn-3yAsoehTvOPjBTPILm3aXosU",
  authDomain: "agriconnect-9ee31.firebaseapp.com",
  projectId: "agriconnect-9ee31",
  storageBucket: "agriconnect-9ee31.firebasestorage.app",
  messagingSenderId: "805313911232",
  appId: "1:805313911232:web:ac0ccc445b421869935025"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Convertir numéro de téléphone en email
const phoneToEmail = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  return `${cleanPhone}@agriconnect.local`;
};

// Données fictives des utilisateurs
const usersData = [
  {
    name: "Amadou Diallo",
    phone: "+221771234567",
    password: "password123",
    products: [
      { productName: "Riz", quantity: 50, unit: "Sac", price: 15000, category: "céréales" },
      { productName: "Mil", quantity: 30, unit: "Sac", price: 12000, category: "céréales" },
      { productName: "Arachide", quantity: 25, unit: "Sac", price: 18000, category: "légumineuses" }
    ]
  },
  {
    name: "Fatou Sarr",
    phone: "+221772345678",
    password: "password123",
    products: [
      { productName: "Tomate", quantity: 100, unit: "Kg", price: 800, category: "légumes" },
      { productName: "Oignon", quantity: 80, unit: "Kg", price: 1200, category: "légumes" },
      { productName: "Pomme de terre", quantity: 150, unit: "Kg", price: 600, category: "légumes" }
    ]
  },
  {
    name: "Ibrahima Ba",
    phone: "+221773456789",
    password: "password123",
    products: [
      { productName: "Mangue", quantity: 200, unit: "Kg", price: 1500, category: "fruits" },
      { productName: "Banane", quantity: 120, unit: "Kg", price: 1000, category: "fruits" },
      { productName: "Orange", quantity: 150, unit: "Kg", price: 1200, category: "fruits" }
    ]
  },
  {
    name: "Aissatou Ndiaye",
    phone: "+221774567890",
    password: "password123",
    products: [
      { productName: "Maïs", quantity: 40, unit: "Sac", price: 14000, category: "céréales" },
      { productName: "Sorgho", quantity: 35, unit: "Sac", price: 13000, category: "céréales" }
    ]
  },
  {
    name: "Moussa Diop",
    phone: "+221775678901",
    password: "password123",
    products: [
      { productName: "Haricot", quantity: 20, unit: "Sac", price: 20000, category: "légumineuses" },
      { productName: "Niébé", quantity: 15, unit: "Sac", price: 22000, category: "légumineuses" },
      { productName: "Sésame", quantity: 10, unit: "Sac", price: 25000, category: "oléagineux" }
    ]
  },
  {
    name: "Mariama Fall",
    phone: "+221776789012",
    password: "password123",
    products: [
      { productName: "Pastèque", quantity: 50, unit: "Kg", price: 500, category: "fruits" },
      { productName: "Melon", quantity: 40, unit: "Kg", price: 700, category: "fruits" }
    ]
  },
  {
    name: "Ousmane Sy",
    phone: "+221777890123",
    password: "password123",
    products: [
      { productName: "Riz", quantity: 60, unit: "Sac", price: 14500, category: "céréales" },
      { productName: "Arachide", quantity: 30, unit: "Sac", price: 17500, category: "légumineuses" }
    ]
  },
  {
    name: "Khadija Kane",
    phone: "+221778901234",
    password: "password123",
    products: [
      { productName: "Carotte", quantity: 90, unit: "Kg", price: 900, category: "légumes" },
      { productName: "Chou", quantity: 70, unit: "Kg", price: 1100, category: "légumes" },
      { productName: "Aubergine", quantity: 60, unit: "Kg", price: 1000, category: "légumes" }
    ]
  }
];

// Images par défaut (URLs d'images libres de droits)
const defaultImages = {
  "riz": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
  "mil": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
  "arachide": "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=400",
  "tomate": "https://images.unsplash.com/photo-1546095667-0e3c4a1b0e0e?w=400",
  "oignon": "https://images.unsplash.com/photo-1618512496249-a07fe83aa8cb?w=400",
  "pomme de terre": "https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400",
  "mangue": "https://images.unsplash.com/photo-1605027990121-cbae3e5e4a5a?w=400",
  "banane": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
  "orange": "https://images.unsplash.com/photo-1580052613815-e1d985137241?w=400",
  "maïs": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400",
  "sorgho": "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=400",
  "haricot": "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
  "niébé": "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400",
  "sésame": "https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=400",
  "pastèque": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400",
  "melon": "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=400",
  "carotte": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
  "chou": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400",
  "aubergine": "https://images.unsplash.com/photo-1606914501445-0e8e0e8a0c8c?w=400"
};

// Fonction pour obtenir l'image par défaut
const getDefaultImage = (productName) => {
  const name = productName.toLowerCase();
  for (const [key, url] of Object.entries(defaultImages)) {
    if (name.includes(key)) {
      return url;
    }
  }
  // Image par défaut si aucune correspondance
  return "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400";
};

// Fonction pour vérifier que Firestore est accessible
async function checkFirestore() {
  try {
    // Essayer de créer un document de test
    const testRef = doc(db, '_test', 'connection');
    await setDoc(testRef, { test: true, timestamp: serverTimestamp() });
    // Supprimer le document de test
    // Note: On ne peut pas supprimer directement, mais ce n'est pas grave
    console.log('✅ Firestore est accessible\n');
    return true;
  } catch (error) {
    console.error('❌ Erreur Firestore:', error.message);
    if (error.code === 5 || error.message.includes('NOT_FOUND')) {
      console.error('\n⚠️  PROBLÈME: Firestore n\'est pas créé ou configuré!');
      console.error('\n📋 Solution:');
      console.error('1. Allez sur https://console.firebase.google.com/');
      console.error('2. Projet: agriconnect-9ee31');
      console.error('3. Menu gauche → Firestore Database');
      console.error('4. Cliquez sur "Create database"');
      console.error('5. Choisissez "Start in test mode"');
      console.error('6. Sélectionnez une localisation');
      console.error('7. Cliquez sur "Enable"');
      console.error('\nEnsuite, réessayez: npm run seed\n');
    }
    return false;
  }
}

// Fonction principale
async function seedDatabase() {
  console.log('🌱 Début de la création des données fictives...\n');
  
  // Vérifier que Firestore est accessible
  const firestoreReady = await checkFirestore();
  if (!firestoreReady) {
    process.exit(1);
  }

  const createdUsers = [];

  for (const userData of usersData) {
    try {
      console.log(`📝 Création de l'utilisateur: ${userData.name}...`);
      
      const email = phoneToEmail(userData.phone);
      
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        userData.password
      );
      
      const user = userCredential.user;
      console.log(`   ✅ Utilisateur créé: ${user.uid}`);

      // Créer les données utilisateur dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        phone: userData.phone,
        email: email,
        createdAt: serverTimestamp()
      });
      console.log(`   ✅ Données utilisateur sauvegardées`);

      // Créer les produits de cet utilisateur
      console.log(`   📦 Création de ${userData.products.length} produit(s)...`);
      
      for (const product of userData.products) {
        try {
          const productData = {
            productName: product.productName,
            quantity: product.quantity,
            unit: product.unit,
            price: product.price,
            imageUrl: getDefaultImage(product.productName),
            sellerId: user.uid,
            sellerName: userData.name,
            sellerPhone: userData.phone,
            createdAt: Timestamp.fromDate(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)), // Date aléatoire dans les 7 derniers jours
            category: product.category
          };

          await addDoc(collection(db, 'products'), productData);
          console.log(`      ✅ ${product.productName} - ${product.quantity} ${product.unit} - ${product.price} FCFA`);
        } catch (productError) {
          console.error(`      ❌ Erreur pour ${product.productName}:`, productError.message);
          if (productError.code === 5 || productError.message.includes('NOT_FOUND')) {
            console.error(`      ⚠️  Firestore n'est pas configuré. Voir les instructions ci-dessus.`);
            break; // Arrêter la boucle des produits pour cet utilisateur
          }
        }
      }

      createdUsers.push({
        name: userData.name,
        phone: userData.phone,
        email: email,
        password: userData.password,
        uid: user.uid
      });

      console.log(`   ✅ ${userData.name} terminé!\n`);

      // Petite pause pour éviter les limites de taux
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`   ❌ Erreur pour ${userData.name}:`, error.message);
      
      if (error.code === 'auth/email-already-in-use') {
        console.log(`   ⚠️  L'utilisateur ${userData.name} existe déjà, passage au suivant...\n`);
      } else {
        console.error(`   ❌ Erreur détaillée:`, error);
      }
    }
  }

  console.log('\n✨ Création terminée!\n');
  console.log('📋 Résumé des utilisateurs créés:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  createdUsers.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.name}`);
    console.log(`   📞 Téléphone: ${user.phone}`);
    console.log(`   📧 Email (pour connexion): ${user.email}`);
    console.log(`   🔑 Mot de passe: ${user.password}`);
  });
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 Vous pouvez maintenant vous connecter avec n\'importe quel compte ci-dessus!');
  
  process.exit(0);
}

// Exécuter le script
seedDatabase().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

