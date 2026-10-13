import React, { useState, useEffect, useRef } from 'react';
import { 
  Scissors, ShoppingBag, Phone, MapPin, Clock, Settings, 
  Plus, Trash2, Edit2, Save, X, ChevronLeft, ChevronRight, 
  MessageCircle, Search, CheckCircle, ArrowRight, ShieldCheck, 
  Star, Menu, AlertCircle, RotateCcw, Eye, Sparkles, Upload,
  Database, Image as ImageIcon, Check, RefreshCw, Smartphone
} from 'lucide-react';

const DB_NAME = "OneTripShopDB";
const DB_VERSION = 1;

// Helper para abrir la base de datos IndexedDB local
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Tabla/Store: Configuración de la Empresa
      if (!db.objectStoreNames.contains("company")) {
        db.createObjectStore("company", { keyPath: "id" });
      }

      // Tabla/Store: Carrusel / Slides
      if (!db.objectStoreNames.contains("slides")) {
        db.createObjectStore("slides", { keyPath: "id", autoIncrement: true });
      }

      // Tabla/Store: Servicios de Barbería
      if (!db.objectStoreNames.contains("services")) {
        db.createObjectStore("services", { keyPath: "id", autoIncrement: true });
      }

      // Tabla/Store: Productos de la Tienda
      if (!db.objectStoreNames.contains("products")) {
        db.createObjectStore("products", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

const defaultCompanyData = {
  id: "main_config",
  name: "One Trip Shop",
  slogan: "Barber Studio & Shop • Estilo y Precisión",
  phone: "529601427950", // Formato WhatsApp internacional México
  address: "Av. Central Poniente #120, Centro, Berriozábal, Chis., México",
  hours: "Lunes a Sábado: 9:00 AM - 8:00 PM",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3820.123456789!2d-93.2845!3d16.8152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDQ4JzU0LjciTiA5M8KwMTcnMDQuMiJX!5e0!3m2!1ses!2smx!4v1600000000000!5m2!1ses!2smx",
  logoText: "OTS"
};

const defaultSlides = [
  {
    id: 1,
    title: "El Arte del Estilo Clásico y Moderno",
    subtitle: "Cortes de precisión, diseño de barba y rituales con toalla caliente en Berriozábal, Chiapas.",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Agendar por WhatsApp",
    ctaLinkService: "Corte Clásico o Desvanecido"
  },
  {
    id: 2,
    title: "Productos Premium para el Cuidado Masculino",
    subtitle: "Lleva tu rutina al siguiente nivel con ceras, aceites y bálsamos de máxima calidad.",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=1200",
    ctaText: "Ver Catálogo",
    ctaLinkService: ""
  }
];

const defaultServices = [
  {
    id: 1,
    name: "Corte Clásico o Desvanecido (Fade)",
    description: "Incluye lavado de cabello, asesoría de imagen personalizada, perfilado y peinado con estilizado profesional.",
    price: "$150 MXN",
    duration: "45 min"
  },
  {
    id: 2,
    name: "Arreglo de Barba Tradicional",
    description: "Perfilado preciso con navaja de afeitar, ritual con toalla caliente, aceites esenciales y bálsamo hidratante.",
    price: "$120 MXN",
    duration: "30 min"
  },
  {
    id: 3,
    name: "Combo OTS (Corte + Barba)",
    description: "La experiencia completa de la casa. Cuidado integral para tu cabello y barba con acabados impecables.",
    price: "$250 MXN",
    duration: "1 hora 15 min"
  }
];

const defaultProducts = [
  {
    id: 1,
    name: "Pomada Mate Fijación Fuerte OTS",
    price: "$220 MXN",
    category: "Cabello",
    description: "Efecto natural sin brillo, aroma fresco y fácil enjuague con agua. Ideal para copetes, texturas y estilos modernos.",
    images: [
      "https://images.unsplash.com/photo-1583209869779-c5c2901332f7?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: 2,
    name: "Aceite Orgánico para Barba 30ml",
    price: "$180 MXN",
    category: "Barba",
    description: "Nutre el vello facial, hidrata la piel de debajo y elimina la resequedad con mezclas de aceite de argán y jojoba.",
    images: [
      "https://images.unsplash.com/photo-1608248597359-994c63283296?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: 3,
    name: "Kit Completo de Aseo (Pomada + Aceite + Peine)",
    price: "$380 MXN",
    category: "Kits",
    description: "El paquete esencial para mantener tu corte y barba impecables en todo momento. Incluye estuche de regalo.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=600"
    ]
  }
];

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function App() {
  const [db, setDb] = useState(null);
  const [dbStatus, setDbStatus] = useState("Conectando...");
  
  // Estados principales alimentados por la Base de Datos IndexedDB
  const [company, setCompany] = useState(defaultCompanyData);
  const [slides, setSlides] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado para Modal de Zoom e Imágenes de Producto
  const [modalProduct, setModalProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    initDatabase().then((database) => {
      setDb(database);
      setDbStatus("SQLite / IndexedDB Conectado");
      loadAllData(database);
    }).catch((err) => {
      console.error("Error al conectar DB:", err);
      setDbStatus("Modo Memoria Volátil");
    });
  }, []);

  // Cargar datos de la BD o inicializar por defecto
  const loadAllData = async (database) => {
    try {
      // 1. Cargar datos Empresa
      const txComp = database.transaction("company", "readonly");
      const compReq = txComp.objectStore("company").get("main_config");
      compReq.onsuccess = () => {
        if (compReq.result) {
          setCompany(compReq.result);
        } else {
          // Si es la primera vez, sembrar
          const saveTx = database.transaction("company", "readwrite");
          saveTx.objectStore("company").put(defaultCompanyData);
          setCompany(defaultCompanyData);
        }
      };

      // 2. Cargar Slides
      const txSlides = database.transaction("slides", "readonly");
      const slidesReq = txSlides.objectStore("slides").getAll();
      slidesReq.onsuccess = () => {
        if (slidesReq.result && slidesReq.result.length > 0) {
          setSlides(slidesReq.result);
        } else {
          const saveTx = database.transaction("slides", "readwrite");
          const store = saveTx.objectStore("slides");
          defaultSlides.forEach(s => store.put(s));
          setSlides(defaultSlides);
        }
      };

      // 3. Cargar Servicios
      const txServ = database.transaction("services", "readonly");
      const servReq = txServ.objectStore("services").getAll();
      servReq.onsuccess = () => {
        if (servReq.result && servReq.result.length > 0) {
          setServices(servReq.result);
        } else {
          const saveTx = database.transaction("services", "readwrite");
          const store = saveTx.objectStore("services");
          defaultServices.forEach(s => store.put(s));
          setServices(defaultServices);
        }
      };

      // 4. Cargar Productos
      const txProd = database.transaction("products", "readonly");
      const prodReq = txProd.objectStore("products").getAll();
      prodReq.onsuccess = () => {
        if (prodReq.result && prodReq.result.length > 0) {
          setProducts(prodReq.result);
        } else {
          const saveTx = database.transaction("products", "readwrite");
          const store = saveTx.objectStore("products");
          defaultProducts.forEach(p => store.put(p));
          setProducts(defaultProducts);
        }
      };

    } catch (e) {
      console.error("Error sincronizando IndexedDB:", e);
    }
  };

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  // Función para abrir mensajes en WhatsApp Business México (+52)
  const openWhatsApp = (customMessage = "Hola One Trip Shop, me gustaría solicitar información o agendar una cita.") => {
    const cleanPhone = company.phone.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank');
  };

  // Filtrado de productos
  const categories = ["Todos", ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-amber-500 selection:text-black">
      
      {}
      <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-amber-500/20 border border-amber-300">
              {company.logoText || "OTS"}
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wider text-white uppercase">{company.name}</h1>
              <p className="text-xs text-amber-400 font-medium">{company.slogan}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#inicio" className="hover:text-amber-400 transition-colors">Inicio</a>
            <a href="#servicios" className="hover:text-amber-400 transition-colors">Servicios</a>
            <a href="#productos" className="hover:text-amber-400 transition-colors">Tienda</a>
            <a href="#contacto" className="hover:text-amber-400 transition-colors">Ubicación</a>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden xl:flex items-center gap-1.5 text-[11px] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
              <Database className="w-3.5 h-3.5" /> IndexedDB / SQLite Activo
            </span>

            <button 
              onClick={() => openWhatsApp("Hola, deseo agendar una cita en One Trip Shop.")}
              className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>

            <button 
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 bg-[#222] hover:bg-amber-500 hover:text-black text-amber-400 px-3.5 py-2 rounded-full text-sm font-medium border border-amber-500/30 transition-all"
              title="Panel Administrador / Gestor de Contenido y Archivos"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">CMS Admin</span>
            </button>
          </div>
        </div>
      </header>

      {}
      <section id="inicio" className="relative h-[550px] sm:h-[620px] overflow-hidden bg-black">
        {slides && slides.map((slide, idx) => (
          <div 
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30 z-10" />
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold uppercase tracking-widest rounded-full backdrop-blur">
                    <Sparkles className="w-3.5 h-3.5" /> One Trip Barber Studio • México
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
                    {slide.title}
                  </h2>
                  <p className="text-base sm:text-lg text-gray-300 font-normal">
                    {slide.subtitle}
                  </p>
                  <div className="pt-3 flex flex-wrap gap-4">
                    <button 
                      onClick={() => openWhatsApp(`Hola, quiero agendar mi cita para: ${slide.ctaLinkService || 'Servicio de Barbería'}`)}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-amber-500/20"
                    >
                      <Scissors className="w-5 h-5" />
                      {slide.ctaText || "Reservar por WhatsApp"}
                    </button>
                    <a 
                      href="#productos" 
                      className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-xl backdrop-blur border border-white/10 transition-all flex items-center gap-2"
                    >
                      Ver Productos <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation arrows for slider */}
        {slides && slides.length > 1 && (
          <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
            <button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-2.5 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white border border-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="p-2.5 rounded-full bg-black/60 hover:bg-amber-500 hover:text-black text-white border border-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </section>

      {}
      <section id="servicios" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Nuestra Especialidad</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Servicios de Barbería</h2>
          <p className="text-gray-400 text-sm sm:text-base">Servicios de corte, perfilado y cuidado masculino con la máxima atención en Berriozábal, Chiapas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-[#141414] border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-2xl">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <span className="text-lg font-bold text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/20">
                    {service.price}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">{service.name}</h3>
                  <p className="text-xs text-amber-500/90 font-medium mt-1">⏱ Tiempo estimado: {service.duration}</p>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button 
                  onClick={() => openWhatsApp(`Hola One Trip Shop, quiero agendar mi cita para el servicio: ${service.name} (${service.price})`)}
                  className="w-full bg-[#222] hover:bg-amber-500 hover:text-black text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm border border-white/5"
                >
                  <MessageCircle className="w-4 h-4" /> Agendar este servicio
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {}
      <section id="productos" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Tienda Oficial</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Productos Profesionales</h2>
            <p className="text-gray-400 text-sm">Productos de calidad premium para el cuidado diario de tu cabello y barba.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#141414] border border-white/10 text-white placeholder-gray-500 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-amber-500 w-full sm:w-60"
              />
            </div>
            
            <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20' : 'bg-[#141414] text-gray-400 hover:text-white border border-white/5'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Cards Rendering */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/5">
            <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No se encontraron productos</h3>
            <p className="text-gray-400 text-sm mt-1">Prueba seleccionando otra categoría o cambiando la búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => {
              const mainImage = prod.images && prod.images.length > 0 ? prod.images[0] : "https://via.placeholder.com/400";
              const hasMultipleImages = prod.images && prod.images.length > 1;

              return (
                <div key={prod.id} className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-2xl">
                  <div>
                    <div 
                      className="relative h-64 bg-black overflow-hidden cursor-pointer" 
                      onClick={() => { setModalProduct(prod); setActiveImageIndex(0); setIsZoomed(false); }}
                    >
                      <img 
                        src={mainImage} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span className="bg-black/80 text-white text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 backdrop-blur font-medium border border-white/10">
                          <Eye className="w-3.5 h-3.5 text-amber-400" /> Ver detalles {hasMultipleImages && `(${prod.images.length})`}
                        </span>
                      </div>
                      <span className="absolute top-3 left-3 bg-black/80 backdrop-blur text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                        {prod.category}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">{prod.name}</h3>
                        <span className="text-lg font-black text-amber-400 whitespace-nowrap">{prod.price}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button 
                      onClick={() => openWhatsApp(`Hola One Trip Shop, me interesa comprar el producto: ${prod.name} (${prod.price})`)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20"
                    >
                      <ShoppingBag className="w-4 h-4" /> Comprar por WhatsApp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {}
      {modalProduct && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-amber-500/30 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            
            <div className="w-full md:w-1/2 bg-black flex flex-col items-center justify-center p-4 relative border-b md:border-b-0 md:border-r border-white/10">
              <button 
                onClick={() => setModalProduct(null)} 
                className="md:hidden absolute top-3 right-3 z-10 bg-black/70 p-2 rounded-full text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full h-72 sm:h-96 flex items-center justify-center overflow-hidden">
                <img 
                  src={modalProduct.images[activeImageIndex] || "https://via.placeholder.com/500"} 
                  alt={modalProduct.name}
                  onClick={() => setIsZoomed(!isZoomed)}
                  className={`max-h-full max-w-full object-contain cursor-zoom-in transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100'}`}
                  title="Da clic para hacer zoom"
                />
              </div>

              {/* Thumbnails */}
              {modalProduct.images && modalProduct.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto max-w-full pb-2">
                  {modalProduct.images.map((imgUrl, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveImageIndex(idx); setIsZoomed(false); }}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60'}`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {modalProduct.category}
                  </span>
                  <button 
                    onClick={() => setModalProduct(null)}
                    className="hidden md:flex text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-2xl font-bold text-white">{modalProduct.name}</h3>
                <p className="text-2xl font-black text-amber-400">{modalProduct.price}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{modalProduct.description}</p>

                <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Calidad garantizada de Barber Studio</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span>Disponible para compra en sucursal o pedido</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button 
                  onClick={() => {
                    openWhatsApp(`Hola One Trip Shop, quiero comprar el producto: ${modalProduct.name} (${modalProduct.price})`);
                    setModalProduct(null);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <MessageCircle className="w-5 h-5" /> Pedir por WhatsApp
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {}
      <section id="contacto" className="py-20 px-4 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Visítanos</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ubicación y Contacto</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Te esperamos en nuestra barbería para brindarte una atención exclusiva en el mejor ambiente de Berriozábal.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 bg-[#141414] p-4 rounded-2xl border border-white/5">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Dirección</h4>
                  <p className="text-gray-400 text-sm mt-0.5">{company.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-[#141414] p-4 rounded-2xl border border-white/5">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Horarios de Atención</h4>
                  <p className="text-gray-400 text-sm mt-0.5">{company.hours}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-[#141414] p-4 rounded-2xl border border-white/5">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">WhatsApp Business</h4>
                  <p className="text-gray-400 text-sm mt-0.5">+{company.phone}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => openWhatsApp("Hola One Trip Shop, me gustaría solicitar indicaciones para llegar a su local.")}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Enviar Mensaje a WhatsApp
            </button>
          </div>

          <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#141414]">
            <iframe 
              title="Mapa de ubicación"
              src={company.mapEmbedUrl}
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }} 
              allowFullScreen="" 
              loading="lazy"
            />
          </div>

        </div>
      </section>

      {}
      <footer className="bg-black border-t border-white/10 py-12 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-black text-black text-base">
              {company.logoText || "OTS"}
            </div>
            <span className="font-bold text-white tracking-wider">{company.name}</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2026 {company.name}. Todos los derechos reservados. Berriozábal, Chiapas, México.
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-xs text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" /> Administrar Base de Datos
            </button>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <button 
        onClick={() => openWhatsApp("Hola One Trip Shop, me comunico desde el sitio web.")}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 flex items-center justify-center group"
        title="Enviar mensaje directo por WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute right-full mr-3 bg-white text-black font-semibold text-xs px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¡Chatea con nosotros!
        </span>
      </button>

      {}
      {isAdminOpen && db && (
        <AdminPanel 
          db={db}
          company={company}
          slides={slides}
          services={services}
          products={products}
          onReloadData={() => loadAllData(db)}
          onClose={() => setIsAdminOpen(false)} 
        />
      )}

    </div>
  );
}

function AdminPanel({ db, company, slides, services, products, onReloadData, onClose }) {
  const [activeTab, setActiveTab] = useState('company');
  const [saveMessage, setSaveMessage] = useState("");

  // Estados locales para formularios
  const [compState, setCompState] = useState(company);
  
  // Producto nuevo
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Cabello");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImages, setNewProdImages] = useState([]);

  // Servicio nuevo
  const [newServName, setNewServName] = useState("");
  const [newServPrice, setNewServPrice] = useState("");
  const [newServDuration, setNewServDuration] = useState("");
  const [newServDesc, setNewServDesc] = useState("");

  // Slide nuevo
  const [newSlideTitle, setNewSlideTitle] = useState("");
  const [newSlideSubtitle, setNewSlideSubtitle] = useState("");
  const [newSlideImage, setNewSlideImage] = useState("");

  const fileInputRefProd = useRef(null);
  const fileInputRefSlide = useRef(null);

  // Guardar configuración general
  const handleSaveCompany = () => {
    const tx = db.transaction("company", "readwrite");
    tx.objectStore("company").put(compState);
    tx.oncomplete = () => {
      showNotification("Configuración de empresa guardada en IndexedDB SQLite");
      onReloadData();
    };
  };

  // Manejador de carga de imágenes desde el móvil / PC para Productos
  const handleImageUploadProduct = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    try {
      const base64Images = await Promise.all(files.map(file => convertFileToBase64(file)));
      setNewProdImages(prev => [...prev, ...base64Images]);
    } catch (error) {
      console.error("Error al procesar las imágenes:", error);
    }
  };

  // Manejador de carga de imágenes desde el móvil / PC para Slides
  const handleImageUploadSlide = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const base64Image = await convertFileToBase64(file);
      setNewSlideImage(base64Image);
    } catch (error) {
      console.error("Error al procesar la imagen del carrusel:", error);
    }
  };

  // Agregar Producto a la Base de Datos
  const handleAddProduct = () => {
    if (!newProdName || !newProdPrice) return;

    const newProduct = {
      name: newProdName,
      price: newProdPrice,
      category: newProdCategory,
      description: newProdDesc,
      images: newProdImages.length > 0 ? newProdImages : ["https://images.unsplash.com/photo-1583209869779-c5c2901332f7?auto=format&fit=crop&q=80&w=600"]
    };

    const tx = db.transaction("products", "readwrite");
    tx.objectStore("products").add(newProduct);
    tx.oncomplete = () => {
      showNotification("Producto guardado exitosamente en SQLite local");
      setNewProdName("");
      setNewProdPrice("");
      setNewProdDesc("");
      setNewProdImages([]);
      onReloadData();
    };
  };

  // Eliminar Producto
  const handleDeleteProduct = (id) => {
    const tx = db.transaction("products", "readwrite");
    tx.objectStore("products").delete(id);
    tx.oncomplete = () => {
      showNotification("Producto eliminado de la base de datos");
      onReloadData();
    };
  };

  // Agregar Servicio
  const handleAddService = () => {
    if (!newServName || !newServPrice) return;

    const newService = {
      name: newServName,
      price: newServPrice,
      duration: newServDuration || "30 min",
      description: newServDesc
    };

    const tx = db.transaction("services", "readwrite");
    tx.objectStore("services").add(newService);
    tx.oncomplete = () => {
      showNotification("Servicio guardado exitosamente");
      setNewServName("");
      setNewServPrice("");
      setNewServDuration("");
      setNewServDesc("");
      onReloadData();
    };
  };

  // Eliminar Servicio
  const handleDeleteService = (id) => {
    const tx = db.transaction("services", "readwrite");
    tx.objectStore("services").delete(id);
    tx.oncomplete = () => {
      showNotification("Servicio eliminado");
      onReloadData();
    };
  };

  // Agregar Slide
  const handleAddSlide = () => {
    if (!newSlideTitle || !newSlideImage) return;

    const newSlide = {
      title: newSlideTitle,
      subtitle: newSlideSubtitle,
      image: newSlideImage,
      ctaText: "Reservar Cita",
      ctaLinkService: ""
    };

    const tx = db.transaction("slides", "readwrite");
    tx.objectStore("slides").add(newSlide);
    tx.oncomplete = () => {
      showNotification("Slide agregado a la base de datos");
      setNewSlideTitle("");
      setNewSlideSubtitle("");
      setNewSlideImage("");
      onReloadData();
    };
  };

  // Eliminar Slide
  const handleDeleteSlide = (id) => {
    const tx = db.transaction("slides", "readwrite");
    tx.objectStore("slides").delete(id);
    tx.oncomplete = () => {
      showNotification("Slide eliminado");
      onReloadData();
    };
  };

  // Reset a valores de fábrica
  const handleResetDatabase = () => {
    if (window.confirm("¿Seguro que deseas reiniciar toda la base de datos local a los valores iniciales?")) {
      const txComp = db.transaction("company", "readwrite");
      txComp.objectStore("company").put(defaultCompanyData);

      const txSlides = db.transaction("slides", "readwrite");
      txSlides.objectStore("slides").clear();
      defaultSlides.forEach(s => txSlides.objectStore("slides").add(s));

      const txServ = db.transaction("services", "readwrite");
      txServ.objectStore("services").clear();
      defaultServices.forEach(s => txServ.objectStore("services").add(s));

      const txProd = db.transaction("products", "readwrite");
      txProd.objectStore("products").clear();
      defaultProducts.forEach(p => txProd.objectStore("products").add(p));

      setTimeout(() => {
        showNotification("Base de datos reiniciada por completo");
        onReloadData();
      }, 300);
    }
  };

  const showNotification = (msg) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(""), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex justify-end">
      <div className="bg-[#121212] w-full max-w-2xl h-full border-l border-amber-500/20 flex flex-col shadow-2xl">
        
        {/* Header Admin */}
        <div className="p-6 bg-[#161616] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-black rounded-xl font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Panel Administrador - CMS</h3>
              <p className="text-xs text-amber-400">Base de datos SQLite local en navegador (IndexedDB)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-[#161616]/50 overflow-x-auto">
          {[
            { id: 'company', label: 'Empresa' },
            { id: 'slides', label: 'Carrusel' },
            { id: 'services', label: 'Servicios' },
            { id: 'products', label: 'Productos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-transparent text-gray-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {saveMessage && (
            <div className="bg-emerald-600/20 border border-emerald-600/50 text-emerald-300 p-4 rounded-xl flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{saveMessage}</span>
            </div>
          )}

          {}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Datos Generales</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Nombre Comercial</label>
                  <input 
                    type="text" 
                    value={compState.name}
                    onChange={(e) => setCompState({...compState, name: e.target.value})}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Siglas Logo</label>
                  <input 
                    type="text" 
                    value={compState.logoText}
                    onChange={(e) => setCompState({...compState, logoText: e.target.value})}
                    className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Eslogan</label>
                <input 
                  type="text" 
                  value={compState.slogan}
                  onChange={(e) => setCompState({...compState, slogan: e.target.value})}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">WhatsApp México (+52 seguido de 10 dígitos)</label>
                <input 
                  type="text" 
                  value={compState.phone}
                  onChange={(e) => setCompState({...compState, phone: e.target.value})}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Dirección Física</label>
                <input 
                  type="text" 
                  value={compState.address}
                  onChange={(e) => setCompState({...compState, address: e.target.value})}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Horario de Atención</label>
                <input 
                  type="text" 
                  value={compState.hours}
                  onChange={(e) => setCompState({...compState, hours: e.target.value})}
                  className="w-full bg-[#1c1c1c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
                />
              </div>

              <button 
                onClick={handleSaveCompany}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-amber-500/20 mt-4"
              >
                <Save className="w-4 h-4" /> Guardar Datos de Empresa
              </button>
            </div>
          )}

          {}
          {activeTab === 'slides' && (
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Carrusel Principal</h4>
              
              <div className="space-y-4">
                {slides.map((slide) => (
                  <div key={slide.id} className="bg-[#1c1c1c] p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                    <img src={slide.image} alt="" className="w-20 h-20 rounded-lg object-cover bg-black" />
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-white">{slide.title}</h5>
                      <p className="text-xs text-gray-400 line-clamp-1">{slide.subtitle}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#1c1c1c] p-5 rounded-xl border border-dashed border-amber-500/40 space-y-4">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Añadir Nuevo Slide</h5>
                
                <input 
                  type="text" 
                  placeholder="Título del Slide"
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                />
                
                <input 
                  type="text" 
                  placeholder="Subtítulo corto"
                  value={newSlideSubtitle}
                  onChange={(e) => setNewSlideSubtitle(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                />

                <div className="space-y-2">
                  <label className="text-xs text-gray-400 block font-medium">Subir Imagen desde Celular o PC</label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRefSlide}
                      onChange={handleImageUploadSlide}
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRefSlide.current?.click()}
                      className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" /> Seleccionar Archivo...
                    </button>
                  </div>
                  {newSlideImage && (
                    <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-amber-500">
                      <img src={newSlideImage} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleAddSlide}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg text-xs"
                >
                  Guardar Slide en Base de Datos
                </button>
              </div>
            </div>
          )}

          {}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Servicios de Barbería</h4>
              
              <div className="space-y-3">
                {services.map((serv) => (
                  <div key={serv.id} className="bg-[#1c1c1c] p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                    <div>
                      <h5 className="text-sm font-bold text-white">{serv.name}</h5>
                      <p className="text-xs text-amber-400">{serv.price} • {serv.duration}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteService(serv.id)}
                      className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#1c1c1c] p-5 rounded-xl border border-dashed border-amber-500/40 space-y-3">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Nuevo Servicio</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nombre del Servicio"
                    value={newServName}
                    onChange={(e) => setNewServName(e.target.value)}
                    className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Precio (Ej. $150 MXN)"
                    value={newServPrice}
                    onChange={(e) => setNewServPrice(e.target.value)}
                    className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Duración (Ej. 45 min)"
                    value={newServDuration}
                    onChange={(e) => setNewServDuration(e.target.value)}
                    className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <textarea 
                  placeholder="Descripción del servicio"
                  value={newServDesc}
                  onChange={(e) => setNewServDesc(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white h-16 resize-none"
                />
                <button 
                  onClick={handleAddService}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg text-xs"
                >
                  Guardar Servicio en Base de Datos
                </button>
              </div>
            </div>
          )}

          {}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Catálogo de Productos</h4>
              
              <div className="space-y-3">
                {products.map((prod) => (
                  <div key={prod.id} className="bg-[#1c1c1c] p-4 rounded-xl border border-white/5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images && prod.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover bg-black" />
                      <div>
                        <h5 className="text-sm font-bold text-white">{prod.name}</h5>
                        <p className="text-xs text-amber-400">{prod.price} • {prod.category}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="text-red-400 p-2 hover:bg-red-500/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-[#1c1c1c] p-5 rounded-xl border border-dashed border-amber-500/40 space-y-4">
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">Nuevo Producto (Subir Fotos desde Móvil / PC)</h5>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input 
                    type="text" 
                    placeholder="Nombre de producto"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Precio ($220 MXN)"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Cabello">Cabello</option>
                    <option value="Barba">Barba</option>
                    <option value="Kits">Kits</option>
                  </select>
                </div>

                <textarea 
                  placeholder="Descripción detallada"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-lg px-3 py-2 text-xs text-white h-16 resize-none"
                />

                {/* Subir Imágenes Locales */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 block font-medium">Fotos de Galería (Dispositivo Local)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    ref={fileInputRefProd}
                    onChange={handleImageUploadProduct}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRefProd.current?.click()}
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" /> Cargar Imágenes de la Galería...
                  </button>

                  {/* Previsualización de imágenes cargadas */}
                  {newProdImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap pt-2">
                      {newProdImages.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-500/50 group">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setNewProdImages(newProdImages.filter((_, i) => i !== idx))}
                            className="absolute top-0 right-0 bg-red-600 text-white p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleAddProduct}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-lg text-xs"
                >
                  Guardar Producto en SQLite Local
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Admin */}
        <div className="p-4 bg-[#161616] border-t border-white/10 flex items-center justify-between">
          <button onClick={handleResetDatabase} className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Reiniciar Base de Datos
          </button>
          <button onClick={onClose} className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium">
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
}