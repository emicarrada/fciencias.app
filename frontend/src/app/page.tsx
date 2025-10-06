'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

// Componente Footer
function FooterSection() {
  const navLinks = [
    { name: 'Inicio', href: '/', ariaLabel: 'Ir al inicio' },
    { name: 'Comunidad', href: '/comunidades', ariaLabel: 'Explorar comunidades' },
    { name: 'Recursos', href: '/recursos', ariaLabel: 'Ver recursos disponibles' },
    { name: 'Crear cuenta', href: '/auth/register', ariaLabel: 'Registrarse en fciencias.app' }
  ];

  const socialLinks = [
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      ariaLabel: 'Seguir en Twitter'
    },
    {
      name: 'Instagram', 
      href: '#',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 7.041.048 6.094.082 5.52.204 5.021.32a4.977 4.977 0 00-1.804 1.175c-.6.6-1.019 1.3-1.175 1.804-.116.5-.238 1.073-.272 2.02C1.73 7.266 1.718 7.674 1.718 11.295c0 3.622.013 4.03.048 4.976.034.947.156 1.52.272 2.02.156.505.575 1.205 1.175 1.805.6.6 1.3 1.019 1.804 1.175.5.116 1.073.238 2.02.272.947.035 1.354.048 4.976.048 3.622 0 4.029-.013 4.976-.048.947-.034 1.52-.156 2.02-.272a4.977 4.977 0 001.804-1.175c.6-.6 1.019-1.3 1.175-1.804.116-.5.238-1.073.272-2.02.034-.947.048-1.355.048-4.976 0-3.622-.013-4.03-.048-4.976-.034-.947-.156-1.52-.272-2.02a4.977 4.977 0 00-1.175-1.804A4.977 4.977 0 0019.995.32c-.5-.116-1.073-.238-2.02-.272C17.028.013 16.62 0 12.998 0h-.98zm-.717 1.442h.718c3.136 0 3.513.012 4.448.048.823.034 1.269.156 1.569.26.394.153.676.336.971.631.296.296.479.578.631.971.104.3.226.746.26 1.569.036.935.048 1.312.048 4.448 0 3.136-.012 3.513-.048 4.448-.034.823-.156 1.269-.26 1.569-.153.394-.336.676-.631.971a2.618 2.618 0 01-.971.631c-.3.104-.746.226-1.569.26-.935.036-1.312.048-4.448.048-3.136 0-3.513-.012-4.448-.048-.823-.034-1.269-.156-1.569-.26a2.618 2.618 0 01-.971-.631 2.618 2.618 0 01-.631-.971c-.104-.3-.226-.746-.26-1.569-.036-.935-.048-1.312-.048-4.448 0-3.136.012-3.513.048-4.448.034-.823.156-1.269.26-1.569.153-.394.336-.676.631-.971a2.618 2.618 0 01.971-.631c.3-.104.746-.226 1.569-.26.935-.036 1.312-.048 4.448-.048z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 15.555a3.555 3.555 0 110-7.11 3.555 3.555 0 010 7.11zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
        </svg>
      ),
      ariaLabel: 'Seguir en Instagram'
    },
    {
      name: 'GitHub',
      href: '#', 
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      ariaLabel: 'Ver repositorio en GitHub'
    }
  ];

  return (
    <footer 
      role="contentinfo"
      className="w-full bg-white border-t border-gray-200 py-10 px-6"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6">
        {/* Logotipo/Marca */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight font-sans">
            fciencias.app
          </span>
        </motion.div>

        {/* Navegación */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 sm:gap-8"
        >
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              aria-label={link.ariaLabel}
              className="text-gray-600 text-sm hover:text-blue-600 transition-colors duration-200 font-sans"
            >
              {link.name}
            </Link>
          ))}
        </motion.nav>

        {/* Redes sociales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex items-center space-x-4"
        >
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              aria-label={social.ariaLabel}
              className="text-gray-500 hover:text-blue-600 transition-all duration-200 hover:scale-110"
            >
              {social.icon}
            </a>
          ))}
        </motion.div>

        {/* Texto de cierre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-xs text-gray-500 text-center leading-relaxed max-w-sm font-sans"
        >
          Proyecto independiente hecho por y para estudiantes de la Facultad de Ciencias 💙
        </motion.p>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-xs text-gray-400 text-center font-sans"
        >
          © 2025 fciencias.app — Todos los derechos reservados.
        </motion.p>
      </div>
    </footer>
  );
}

// Componente Testimonios
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Ana López",
      career: "Matemáticas Aplicadas",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
      quote: "Gracias a fciencias.app encontré mi grupo de cálculo y compartimos apuntes todos los días 🙌",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      name: "Mateo Rivera", 
      career: "Física",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote: "Me encanta descubrir eventos nuevos y proyectos con gente de otras carreras 🔬",
      bgColor: "from-green-50 to-green-100"
    },
    {
      name: "Mariana Cruz",
      career: "Biología", 
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote: "Por fin algo que sí usamos los de la Fac 😎",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      name: "Diego Sánchez",
      career: "Ciencias de la Computación",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", 
      quote: "Aquí encontré compañeros para hackathons y proyectos de programación 💻",
      bgColor: "from-orange-50 to-orange-100"
    },
    {
      name: "Sofía Hernández",
      career: "Actuaría",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      quote: "Los apuntes compartidos me salvaron en estadística y probabilidad 📊",
      bgColor: "from-pink-50 to-pink-100"
    },
    {
      name: "Carlos Mendoza",
      career: "Ciencias de la Tierra",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      quote: "Increíble poder conectar con gente de geología y geofísica en un solo lugar 🌍",
      bgColor: "from-indigo-50 to-indigo-100"
    }
  ];

  return (
    <section 
      aria-label="Testimonios de la comunidad"
      className="w-full flex flex-col items-center justify-center py-20 px-6 bg-gray-50"
    >
      <div className="max-w-5xl mx-auto">
        {/* Título de sección */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight font-sans"
          >
            Lo que dice la comunidad de Ciencias.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-3 text-gray-600 text-center text-sm md:text-base max-w-md mx-auto font-sans"
          >
            Historias reales de estudiantes que usan fciencias.app para aprender, conectar y compartir.
          </motion.p>
        </div>

        {/* Contenedor de testimonios */}
        <div className="grid gap-6 w-full sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center text-center hover:scale-[1.02]"
            >
              {/* Avatar */}
              <div className={`w-16 h-16 rounded-full mb-4 bg-gradient-to-br ${testimonial.bgColor} p-0.5`}>
                <img
                  src={testimonial.avatar}
                  alt={`Foto de ${testimonial.name}`}
                  className="w-full h-full rounded-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Nombre */}
              <h3 className="text-base font-semibold text-gray-900 font-sans">
                {testimonial.name}
              </h3>

              {/* Carrera */}
              <p className="text-gray-500 text-sm mb-4 font-sans">
                {testimonial.career}
              </p>

              {/* Testimonio */}
              <blockquote className="text-gray-700 text-sm italic leading-relaxed font-sans">
                <span className="text-gray-400 text-base">"</span>
                {testimonial.quote}
                <span className="text-gray-400 text-base">"</span>
              </blockquote>
            </motion.div>
          ))}
        </div>

        {/* CTA suave */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-700 text-sm mb-4 font-sans">
            Únete a la comunidad y escribe tu propia historia.
          </p>
          <Link href="/auth/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 font-sans">
              Crear cuenta gratis
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Componente Demo Interactiva
function DemoSection() {
  return (
    <section 
      aria-label="Vista previa interactiva de la app"
      className="flex flex-col items-center justify-center py-20 px-6 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Título de sección */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight font-sans"
        >
          Así se vive la comunidad en fciencias.app
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-3 text-gray-600 text-center text-sm md:text-base max-w-md mx-auto font-sans"
        >
          Crea tu perfil, comparte tus ideas y conecta con otros estudiantes.
        </motion.p>

        {/* Mockup visual principal */}
        <div className="mt-10 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Teléfono mockup */}
            <div className="w-80 max-w-xs rounded-3xl shadow-2xl border border-gray-200 overflow-hidden bg-white mx-auto">
              {/* Header del teléfono */}
              <div className="bg-gray-900 h-6 rounded-t-3xl relative">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full"></div>
              </div>
              
              {/* Contenido del mockup */}
              <div className="aspect-[9/16] bg-white">
                {/* Header de la app */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-bold">F</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">fciencias.app</span>
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                </div>

                {/* Feed simulado */}
                <div className="p-4 space-y-4">
                  {/* Post 1 */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">@ana_fisica</span>
                    </div>
                    <div className="bg-blue-100 h-20 rounded-lg mb-2"></div>
                    <p className="text-xs text-gray-800">Apuntes de Óptica disponibles 📚</p>
                    <div className="flex space-x-3 mt-2 text-xs text-gray-500">
                      <span>❤️ 24</span>
                      <span>💬 5</span>
                    </div>
                  </div>

                  {/* Post 2 */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">@carlos_mate</span>
                    </div>
                    <p className="text-xs text-gray-800 mb-2">Grupo de estudio para Cálculo IV 📐</p>
                    <div className="flex space-x-3 text-xs text-gray-500">
                      <span>❤️ 12</span>
                      <span>💬 8</span>
                    </div>
                  </div>

                  {/* Post 3 (parcial) */}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                      <span className="text-xs font-medium text-gray-700">@sofia_bio</span>
                    </div>
                    <div className="bg-green-100 h-16 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Burbujas flotantes decorativas */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="absolute -top-4 -left-8 bg-blue-100 text-blue-700 text-xs px-3 py-2 rounded-full shadow-sm"
            >
              📘 +100 apuntes nuevos
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
              className="absolute top-1/3 -right-8 bg-green-100 text-green-700 text-xs px-3 py-2 rounded-full shadow-sm"
            >
              🔬 Eventos esta semana
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              viewport={{ once: true }}
              className="absolute bottom-8 -left-6 bg-purple-100 text-purple-700 text-xs px-3 py-2 rounded-full shadow-sm"
            >
              👥 Grupos activos
            </motion.div>
          </motion.div>
        </div>

        {/* CTA complementario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-gray-700 text-sm mb-4 font-sans">
            Únete y empieza a compartir.
          </p>
          <Link href="/auth/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 font-sans">
              Crear cuenta gratis
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Componente Comunidad FCiencias
function CommunitySection() {
  const pillars = [
    {
      icon: "📝",
      title: "Apuntes y resúmenes",
      description: "Encuentra y comparte materiales útiles para tus materias.",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: "🧪",
      title: "Eventos y proyectos", 
      description: "Descubre actividades, talleres y colaboraciones.",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      icon: "💬",
      title: "Conecta con tu carrera",
      description: "Conoce a otros estudiantes y comparte tus intereses.",
      bgGradient: "from-purple-50 to-purple-100"
    }
  ];

  return (
    <section 
      aria-label="Comunidad FCiencias"
      className="w-full flex flex-col items-center justify-center py-16 px-6 bg-white"
    >
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Título de sección */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight font-sans"
          >
            Una red creada por y para estudiantes de la Facultad de Ciencias.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mt-3 text-gray-600 text-center text-sm md:text-base max-w-md mx-auto font-sans"
          >
            Explora, comparte y colabora en los temas que más te apasionan.
          </motion.p>
        </div>

        {/* Tarjetas principales */}
        <div className="mt-10 flex flex-col gap-6 w-full max-w-sm mx-auto sm:max-w-none sm:grid sm:grid-cols-3 sm:gap-8">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col items-center text-center hover:scale-[1.02] border border-gray-100"
            >
              {/* Ícono */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pillar.bgGradient} flex items-center justify-center mb-4`}>
                <span className="text-2xl" aria-hidden="true">
                  {pillar.icon}
                </span>
              </div>

              {/* Título */}
              <h3 className="text-lg font-semibold text-gray-900 mt-2 font-sans">
                {pillar.title}
              </h3>

              {/* Descripción */}
              <p className="text-gray-600 text-sm mt-2 leading-relaxed font-sans">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA complementario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-700 text-sm mb-4 font-sans">
            Forma parte de la comunidad FCiencias.
          </p>
          <Link href="/auth/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 font-sans">
              Crea tu cuenta ahora
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Componente Preview Social moderno estilo red social
function PreviewSocialSection() {
  const mockPosts = [
    {
      username: "@ana_fisica",
      content: "Busco grupo para lab de Óptica 👀",
      likes: 12,
      comments: 3,
      bgColor: "bg-blue-100"
    },
    {
      username: "@mateo_cs", 
      content: "Apuntes de Estructuras de Datos disponibles 📚",
      likes: 24,
      comments: 7,
      bgColor: "bg-green-100"
    },
    {
      username: "@sofia_bio",
      content: "¿Alguien más vio el eclipse desde CU? 🌙",
      likes: 18,
      comments: 5,
      bgColor: "bg-purple-100"
    },
    {
      username: "@diego_mate",
      content: "Grupo de estudio para Cálculo IV 📐",
      likes: 9,
      comments: 4,
      bgColor: "bg-orange-100"
    },
    {
      username: "@vale_quimica",
      content: "Experimento de síntesis salió perfecto! ⚗️",
      likes: 31,
      comments: 8,
      bgColor: "bg-pink-100"
    },
    {
      username: "@alex_cs",
      content: "Hackathon este fin de semana, ¿se apuntan? 💻",
      likes: 15,
      comments: 6,
      bgColor: "bg-indigo-100"
    }
  ];

  return (
    <section 
      aria-label="Vista previa de publicaciones"
      className="w-full py-16 px-4 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Título de sección */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-gray-900 md:text-4xl font-sans"
        >
          Explora lo que comparten los estudiantes de Ciencias.
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-2 text-gray-600 text-sm md:text-base font-sans"
        >
          Desde apuntes y memes hasta eventos y proyectos. Todo está aquí.
        </motion.p>

        {/* Carrusel horizontal de posts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 overflow-x-auto scrollbar-hide"
        >
          <div className="flex space-x-4 py-6 px-2">
            {mockPosts.map((post, index) => (
              <div 
                key={index}
                className="min-w-[250px] bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex-shrink-0"
              >
                {/* Imagen simulada */}
                <div className={`${post.bgColor} h-40 rounded-xl mb-3 flex items-center justify-center`}>
                  <span className="text-gray-500 text-sm font-medium">📱 Contenido</span>
                </div>

                {/* Usuario */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {post.username[1].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium text-sm font-sans">
                    {post.username}
                  </span>
                </div>

                {/* Contenido del post */}
                <p className="text-gray-800 text-sm mb-3 font-sans leading-relaxed">
                  {post.content}
                </p>

                {/* Reacciones */}
                <div className="flex items-center space-x-4 text-gray-500">
                  <div className="flex items-center space-x-1">
                    <span className="text-red-500">❤️</span>
                    <span className="text-xs">{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span className="text-xs">{post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA secundario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <p className="text-gray-600 text-sm mb-4 font-sans">
            Únete y comparte tus propias publicaciones.
          </p>
          <Link href="/auth/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 font-sans">
              Crea tu cuenta
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Componente Hero moderno estilo red social
function HeroSection() {
  return (
    <section 
      role="banner" 
      className="flex flex-col items-center justify-center min-h-[90vh] mt-16 px-4 text-center"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Slogan Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-bold text-gray-900 leading-tight md:text-5xl font-sans"
        >
          Conecta con la comunidad de Ciencias UNAM.
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gray-600 text-base md:text-lg font-sans"
        >
          Notas, eventos, proyectos y todo lo que pasa en la Fac. en un solo lugar.
        </motion.p>

        {/* Botón CTA Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/auth/register">
            <button
              aria-label="Crear cuenta gratuita"
              className="w-11/12 sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 font-sans"
            >
              Crea tu cuenta gratis
            </button>
          </Link>
        </motion.div>

        {/* Mockup/Imagen ilustrativa */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex justify-center"
        >
          <div className="w-3/4 max-w-sm">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                  <div className="h-4 bg-white/20 rounded flex-1"></div>
                </div>
                <div className="h-3 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
                <div className="space-y-2 pt-2">
                  <div className="h-2 bg-white/20 rounded"></div>
                  <div className="h-2 bg-white/20 rounded w-5/6"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-sans">
              Vista previa del feed de la comunidad
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Preview Social Section */}
      <PreviewSocialSection />

      {/* Community Section */}
      <CommunitySection />

      {/* Demo Section */}
      <DemoSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
