'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

// Componente Footer - Discreto y legitimador sin ser intimidante
function FooterSection() {
  return (
    <footer 
      role="contentinfo"
      className="w-full bg-gray-50 border-t border-gray-200 py-8 px-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Texto principal */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xs md:text-sm text-gray-600 text-center leading-relaxed mb-4"
        >
          fciencias.app es un proyecto independiente,
          <br />
          no afiliado oficialmente a ninguna institución.
        </motion.p>

        {/* Links */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-6"
        >
          <Link
            href="/privacy"
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
          >
            Política de privacidad
          </Link>
          <span className="text-gray-400">·</span>
          <Link
            href="/contact"
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200"
          >
            Contacto
          </Link>
        </motion.nav>
      </div>
    </footer>
  );
}

// Sección final de conversión - Autorizar la acción sin presión
function FinalCTASection() {
  return (
    <section 
      aria-label="Únete a la comunidad"
      className="w-full py-24 px-6 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-xl mx-auto text-center space-y-8">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
        >
          Entra, mira qué hay y decide después.
        </motion.h2>

        {/* CTA Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="pt-4"
        >
          <Link href="/auth/register">
            <button
              aria-label="Entrar ahora"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-lg font-medium text-lg transition-colors duration-200"
            >
              Entrar ahora
            </button>
          </Link>
          
          {/* Texto de refuerzo */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xs text-gray-500 mt-3"
          >
            Sin compromisos. Sin presión.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// Sección "La tienda de la comunidad" - Mostrar valor práctico sin ser comercial
function CommunityStoreSection() {
  const benefits = [
    "Sin intermediarios.",
    "Sin comisiones.",
    "Entre estudiantes."
  ];

  return (
    <section 
      aria-label="La tienda de la comunidad"
      className="w-full py-20 px-6 bg-gray-50"
    >
      <div className="max-w-lg mx-auto text-center space-y-8">
        {/* Ícono discreto opcional */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
          </div>
        </motion.div>

        {/* Título de sección */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight"
        >
          La tienda de la comunidad
        </motion.h2>

        {/* Texto principal */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-base md:text-lg text-gray-700 leading-relaxed"
        >
          Compra y vende libros, apuntes, servicios, comida o arte entre personas de Ciencias.
        </motion.p>

        {/* Texto de apoyo en líneas cortas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="space-y-3 pt-2"
        >
          {benefits.map((benefit, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-sm md:text-base text-gray-600 leading-relaxed"
            >
              {benefit}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Sección "Tu espacio, a tu manera" - Reducir miedo y generar sensación de seguridad
function YourSpaceSection() {
  const privacyPoints = [
    "Tu correo es privado.",
    "Tu identidad solo se muestra si tú quieres.",
    "Puedes entrar, leer y participar a tu ritmo."
  ];

  return (
    <section 
      aria-label="Tu espacio, a tu manera"
      className="w-full py-24 px-6 bg-white"
    >
      <div className="max-w-lg mx-auto text-center space-y-10">
        {/* Ícono discreto opcional */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </motion.div>

        {/* Título de sección */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight"
        >
          Tu espacio, a tu manera
        </motion.h2>

        {/* Texto principal en líneas separadas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          {privacyPoints.map((point, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="text-base md:text-lg text-gray-700 leading-relaxed"
            >
              {point}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Sección "¿Qué es fciencias.app?" - Claridad antes que conversión
function WhatIsSection() {
  const features = [
    {
      iconSrc: "/icons/icons8-chat-bubble-pixels/icons8-chat-bubble-32.png",
      text: "Hablar de lo que pasa en la facultad"
    },
    {
      iconSrc: "/icons/icons8-anonymous-mask-pixels/icons8-anonymous-mask-32.png",
      text: "Publicar de forma anónima si lo prefieres"
    },
    {
      iconSrc: "/icons/icons8-books-pixels/icons8-books-32.png",
      text: "Compartir dudas, consejos y experiencias"
    },
    {
      iconSrc: "/icons/icons8-get-cash-pixels/icons8-get-cash-32.png",
      text: "Comprar y vender entre estudiantes de Ciencias"
    }
  ];

  return (
    <section 
      aria-label="¿Qué es fciencias.app?"
      className="w-full py-20 px-6 bg-gray-50"
    >
      <div className="max-w-xl mx-auto text-center space-y-8">
        {/* Título de sección */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight"
        >
          ¿Qué es fciencias.app?
        </motion.h2>

        {/* Texto introductorio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-base text-gray-700 leading-relaxed"
        >
          Un espacio digital hecho para la comunidad de Ciencias.
        </motion.p>

        {/* Lista de posibilidades */}
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-5 text-left max-w-md mx-auto"
        >
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start space-x-3"
            >
              <Image
                src={feature.iconSrc}
                alt=""
                width={32}
                height={32}
                className="flex-shrink-0"
              />
              <span className="text-base text-gray-800 leading-relaxed pt-1">
                {feature.text}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Texto de cierre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="text-sm text-gray-600 leading-relaxed pt-2"
        >
          Todo en un solo lugar, hecho para la comunidad.
        </motion.p>
      </div>
    </section>
  );
}

// Hero Section - Minimalista y centrado en reducir ansiedad
function HeroSection() {
  return (
    <section 
      role="banner" 
      className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center"
    >
      <div className="max-w-xl mx-auto space-y-8">
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Donde Ciencias habla sin filtros.
        </h1>

        {/* Subtítulo con salto de línea */}
        <div className="space-y-2">
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Un espacio para estudiantes y exalumnos de Ciencias.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Publica, opina y pregunta. Puedes hacerlo de forma anónima.
          </p>
        </div>

        {/* CTA Principal */}
        <div className="pt-4">
          <Link href="/auth/register">
            <button
              aria-label="Entrar ahora"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-lg font-medium text-lg transition-colors duration-200"
            >
              Entrar ahora
            </button>
          </Link>
          
          {/* Texto secundario de bajo compromiso */}
          <p className="text-xs text-gray-500 mt-3">
            Toma menos de un minuto
          </p>
        </div>
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

      {/* What Is Section */}
      <WhatIsSection />

      {/* Your Space Section */}
      <YourSpaceSection />

      {/* Community Store Section */}
      <CommunityStoreSection />

      {/* Final CTA Section */}
      <FinalCTASection />

      {/* Footer Section */}
      <FooterSection />
    </div>
  );
}
