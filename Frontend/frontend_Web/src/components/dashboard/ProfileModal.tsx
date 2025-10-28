import React, { useState, useEffect, useRef } from 'react';
import { X, User, Camera, Upload, Check } from 'lucide-react';
import { getUserProfile, getUserPhoto, updateUserProfile } from '@/api/services/userApi';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate?: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    userId: null as number | null
  });
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    userId: null as number | null
  });
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const loadProfile = async () => {
        try {
          const data = await getUserProfile();
          setProfileData({ name: data.name, email: data.email, userId: data.userId });
          setOriginalData({ name: data.name, email: data.email, userId: data.userId });

          // Cargar foto de perfil
          if (data.userId) {
            console.log("Cargando foto en modal para usuario:", data.userId);
            const photoUrl = await getUserPhoto(data.userId);
            console.log("Foto cargada en modal:", photoUrl);
            setUserPhoto(photoUrl);
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          // Si hay error de autenticación, intentar refrescar la página
          if (error instanceof Error && (error.message?.includes('401') || error.message?.includes('Error 401'))) {
            console.log("Token expirado, refrescando página...");
            window.location.reload();
          }
        }
      };
      loadProfile();
    } else {
      // Limpiar estados cuando se cierra el modal
      setSelectedPhoto(null);
      setPhotoPreview(null);
    }
  }, [isOpen]);

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 2MB para evitar problemas de base de datos)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no puede ser mayor a 2MB');
      return;
    }

    setSelectedPhoto(file);
    // Crear preview de la imagen seleccionada
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Función para verificar si hay cambios
  const hasChanges = () => {
    return (
      profileData.name !== originalData.name ||
      profileData.email !== originalData.email ||
      selectedPhoto !== null
    );
  };

  const handleUpdateProfile = async () => {
    // Validar nombre
    if (!profileData.name.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    // Validar email
    if (!profileData.email.trim()) {
      alert('El correo electrónico no puede estar vacío');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    setIsUpdating(true);
    try {
      console.log('Actualizando perfil con datos:', {
        name: profileData.name,
        email: profileData.email,
        hasPhoto: !!selectedPhoto
      });

      await updateUserProfile(profileData.name, profileData.email, selectedPhoto || undefined);

      console.log('Perfil actualizado exitosamente en el backend');

      // Mostrar notificación de éxito
      setShowSuccessNotification(true);

      // Actualizar datos originales y limpiar preview
      setOriginalData({ ...profileData });

      // Limpiar foto actual para forzar recarga
      setUserPhoto(null);
      setSelectedPhoto(null);
      setPhotoPreview(null);

      // Recargar foto desde servidor con delay
      if (profileData.userId) {
        setTimeout(async () => {
          try {
            console.log('Recargando foto después de actualización...');
            const updatedPhotoUrl = await getUserPhoto(profileData.userId!);
            console.log('Foto recargada:', updatedPhotoUrl);
            setUserPhoto(updatedPhotoUrl);
          } catch (photoError) {
            console.log('Error recargando foto, usando null:', photoError);
            setUserPhoto(null);
          }
        }, 200);
      }

      // Notificar al componente padre para refrescar el perfil
      if (onProfileUpdate) {
        console.log('Notificando al componente padre para refrescar perfil');
        onProfileUpdate();
      }

      // Auto-cerrar notificación después de 3 segundos
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);

    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(`Error al actualizar el perfil: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>

      {/* Notificación de éxito */}
      {showSuccessNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span className="font-medium">Perfil actualizado correctamente</span>
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-80 transform transition-all animate-slide-in border border-gray-200">
          {/* Header del Modal */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Mi Perfil
                </h2>
                <p className="text-xs text-gray-500">Información personal</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Contenido del Modal */}
          <div className="p-4 space-y-4">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                  <img
                    src={photoPreview || userPhoto || "/byte.png"}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover ring-3 ring-blue-100"
                    onError={(e) => {
                      console.error("Error cargando imagen:", e);
                      const target = e.target as HTMLImageElement;
                      target.src = "/byte.png";
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-full transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              <p className="text-xs text-gray-500 text-center">Haz clic en la cámara para cambiar tu foto</p>
              {selectedPhoto && (
                <p className="text-xs text-green-600 text-center">Nueva foto seleccionada - se actualizará al guardar</p>
              )}
            </div>
            {/* Campos del formulario */}
            <div className="space-y-3">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <User className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
              </div>

              {/* Correo electrónico (editable) */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="flex-1 bg-transparent text-sm text-gray-900 outline-none"
                    placeholder="Ingresa tu correo electrónico"
                  />
                </div>
              </div>

              {/* Botón único para actualizar todo */}
              <button
                onClick={handleUpdateProfile}
                disabled={isUpdating || !hasChanges()}
                className={`w-full text-white text-sm py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  isUpdating || !hasChanges()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Actualizar Perfil
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default ProfileModal;