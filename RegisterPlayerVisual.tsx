import { Crown, UserPlus, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

/**
 * VERSIÓN SOLO DISEÑO - SIN FUNCIONALIDAD
 * 
 * Este componente muestra ÚNICAMENTE la parte visual del formulario de registro.
 * No tiene validación, no guarda datos, no hay lógica.
 * Es perfecto para ver el diseño puro.
 */

export function RegisterPlayerVisual() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
      {/* ========================================
          DEGRADADO DE FONDO
          ======================================== */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

      {/* ========================================
          PIEZAS DE AJEDREZ DECORATIVAS
          ======================================== */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-10 left-10 text-6xl">♔</div>
        <div className="absolute top-40 right-20 text-5xl">♕</div>
        <div className="absolute bottom-20 left-1/4 text-7xl">♘</div>
        <div className="absolute bottom-40 right-1/3 text-6xl">♖</div>
        <div className="absolute top-1/3 right-10 text-5xl">♗</div>
      </div>

      {/* ========================================
          CONTENIDO PRINCIPAL
          ======================================== */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        {/* ========================================
            BOTÓN VOLVER (TOP LEFT)
            ======================================== */}
        <Button
          variant="ghost"
          className="absolute top-8 left-8 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver al menú
        </Button>

        {/* ========================================
            TÍTULO DE LA PÁGINA
            ======================================== */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Crown className="w-10 h-10 text-amber-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Registro de Jugador
            </h1>
          </div>
          <p className="text-slate-400">
            Crea tu cuenta para comenzar a jugar
          </p>
        </div>

        {/* ========================================
            FORMULARIO DE REGISTRO
            ======================================== */}
        <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <form className="p-8 space-y-6">
            
            {/* ========================================
                CAMPO: NOMBRE DE JUGADOR
                ======================================== */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Nombre de Jugador
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* ========================================
                CAMPO: CONTRASEÑA
                ======================================== */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ========================================
                CAMPO: CONFIRMAR CONTRASEÑA
                ======================================== */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-200">
                Confirmar Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  className="pl-10 pr-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ========================================
                OPCIÓN: VINCULAR EMAIL
                ======================================== */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="linkEmail"
                  className="border-slate-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label
                  htmlFor="linkEmail"
                  className="text-slate-200 cursor-pointer"
                >
                  Vincular correo electrónico (opcional)
                </Label>
              </div>

              {/* Campo de Email (oculto por defecto) */}
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                <Label htmlFor="email" className="text-slate-200">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-10 bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>

            {/* ========================================
                BOTÓN: CREAR CUENTA
                ======================================== */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-6"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Crear Cuenta
            </Button>
          </form>
        </Card>

        {/* ========================================
            TEXTO INFORMATIVO (FOOTER)
            ======================================== */}
        <p className="text-slate-500 text-sm mt-6 max-w-md text-center">
          Al registrarte, podrás guardar tu progreso, competir en torneos y seguir tu historial de partidas.
        </p>
      </div>
    </div>
  );
}
