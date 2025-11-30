import { Phone, Package, DollarSign, Calendar } from 'lucide-react'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { useState, useEffect } from 'react'
import { storage } from '../firebase/config'

function ProductCard({ product }) {
  const [imageUrl, setImageUrl] = useState(null)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'image depuis Firebase Storage
    if (product.imageUrl) {
      if (product.imageUrl.startsWith('http')) {
        // URL directe
        setImageUrl(product.imageUrl)
        setImageLoading(false)
      } else {
        // Référence Firebase Storage
        const imageRef = ref(storage, product.imageUrl)
        getDownloadURL(imageRef)
          .then((url) => {
            setImageUrl(url)
            setImageLoading(false)
          })
          .catch((error) => {
            console.error('Erreur lors du chargement de l\'image:', error)
            setImageLoading(false)
          })
      }
    } else {
      setImageLoading(false)
    }
  }, [product.imageUrl])

  const handleCall = () => {
    if (product.sellerPhone) {
      window.location.href = `tel:${product.sellerPhone}`
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date inconnue'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatQuantity = (quantity, unit) => {
    if (!quantity) return 'Quantité non spécifiée'
    return `${quantity} ${unit || ''}`.trim()
  }

  const formatPhone = (phone) => {
    if (!phone) return 'Non disponible'
    return phone
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image du produit */}
      <div className="relative h-48 bg-gray-200">
        {imageLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={product.productName || 'Produit'}
            className="w-full h-full object-cover"
            onError={() => setImageUrl(null)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Contenu de la carte */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {product.productName || 'Produit sans nom'}
        </h3>

        <div className="space-y-2 mb-4">
          {/* Quantité */}
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            <span className="text-sm">
              {formatQuantity(product.quantity, product.unit)}
            </span>
          </div>

          {/* Prix */}
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">
              {product.price ? `${product.price} FCFA` : 'Prix non spécifié'}
            </span>
          </div>

          {/* Date */}
          {product.createdAt && (
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">{formatDate(product.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Bouton d'appel */}
        {product.sellerPhone && (
          <button
            onClick={handleCall}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Appeler le vendeur
          </button>
        )}

        {/* Informations vendeur */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          {product.sellerName && (
            <p className="text-xs text-gray-500 mb-1">
              Vendeur: <span className="font-medium">{product.sellerName}</span>
            </p>
          )}
          {product.sellerPhone && (
            <p className="text-xs text-gray-500">
              {formatPhone(product.sellerPhone)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard

