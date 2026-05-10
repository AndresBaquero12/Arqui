import { 
  Crown, 
  Play, 
  Settings, 
  BookOpen, 
  Trophy, 
  Users,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

/**
 * VERSIÓN SOLO DISEÑO - SIN FUNCIONALIDAD
 * 
 * Este componente muestra ÚNICAMENTE la parte visual del menú.
 * No tiene estados, no tiene lógica, no tiene eventos.
 * Es perfecto para ver el diseño puro o usarlo como referencia.
 */

export function ChessMenuVisual() {
  // DATOS VISUALES - Solo información para mostrar
  const menuItems = [
    {
      id: "new-game",
      label: "Nueva Partida",
      icon: Play,
      color: "from-emerald-500 to-teal-600",
      description: "Comienza una nueva partida"
    },
    {
      id: "quick-play",
      label: "Partida Rápida",
      icon: Clock,
      color: "from-blue-500 to-cyan-600",
      description: "Juego rápido de 10 minutos"
    },
    {
      id: "multiplayer",
      label: "Multijugador",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      description: "Juega con otros jugadores"
    },
    {
      id: "tournaments",
      label: "Torneos",
      icon: Trophy,
      color: "from-amber-500 to-orange-600",
      description: "Compite en torneos"
    },
    {
      id: "learn",
      label: "Aprender",
      icon: BookOpen,
      color: "from-indigo-500 to-blue-600",
      description: "Tutoriales y lecciones"
    },
    {
      id: "settings",
      label: "Configuración",
      icon: Settings,
      color: "from-slate-500 to-gray-600",
      description: "Ajustes de la aplicación"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* ========================================
          CAPA 1: IMAGEN DE FONDO CON OPACIDAD
          ======================================== */}
      <div className="absolute inset-0 opacity-20">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1739416333363-4b01dd9874c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMGJvYXJkJTIwcGllY2VzJTIwZGFya3xlbnwxfHx8fDE3NzI3NDk2ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Chess board"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* ========================================
          CAPA 2: DEGRADADO OSCURO SOBRE LA IMAGEN
          ======================================== */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

      {/* ========================================
          CAPA 3: PIEZAS DE AJEDREZ DECORATIVAS
          ======================================== */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 text-6xl">♔</div>
        <div className="absolute top-40 right-20 text-5xl">♕</div>
        <div className="absolute bottom-20 left-1/4 text-7xl">♘</div>
        <div className="absolute bottom-40 right-1/3 text-6xl">♖</div>
        <div className="absolute top-1/3 right-10 text-5xl">♗</div>
      </div>

      {/* ========================================
          CAPA 4: CONTENIDO PRINCIPAL
          ======================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        {/* ========================================
            TÍTULO PRINCIPAL CON CORONAS
            ======================================== */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Crown className="w-12 h-12 text-amber-400" />
            <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              CHESS MASTER
            </h1>
            <Crown className="w-12 h-12 text-amber-400" />
          </div>
          <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            El juego de los reyes
            <Sparkles className="w-4 h-4" />
          </p>
        </div>

        {/* ========================================
            GRID DE OPCIONES DEL MENÚ (6 TARJETAS)
            ======================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Card
                key={item.id}
                className="relative overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800/70"
              >
                {/* Degradado de color que aparece al hacer hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent hover:from-amber-500/20 hover:to-amber-600/20 transition-all duration-300" />
                
                <Button
                  variant="ghost"
                  className="w-full h-full p-6 flex flex-col items-start justify-between min-h-[140px] relative z-10 hover:bg-transparent"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Icono con degradado de color */}
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} transition-transform duration-300 hover:scale-110 hover:rotate-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Título de la opción */}
                    <div className="flex-1 text-left">
                      <h3 className="text-white font-semibold text-lg">
                        {item.label}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Descripción */}
                  <p className="text-slate-400 text-sm mt-2">
                    {item.description}
                  </p>
                </Button>
              </Card>
            );
          })}
        </div>

        {/* ========================================
            BOTÓN DE REGISTRO EN EL FOOTER
            ======================================== */}
        <div className="mt-12 text-center space-y-4">
          <Button
            variant="outline"
            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
          >
            <Users className="w-4 h-4 mr-2" />
            Registrar Jugador
          </Button>
        </div>
      </div>
    </div>
  );
}
