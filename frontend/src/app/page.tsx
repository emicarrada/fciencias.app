export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                FcienciasApp
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button className="btn-primary">
                Iniciar Sesión
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Bienvenido a FcienciasApp
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            La red social académica de la Facultad de Ciencias de la UNAM
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Anuncios Académicos
              </h3>
              <p className="text-gray-600">
                Mantente al día con avisos importantes de la facultad
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Eventos Estudiantiles
              </h3>
              <p className="text-gray-600">
                Descubre y participa en eventos de la comunidad
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comunidades
              </h3>
              <p className="text-gray-600">
                Conéctate con grupos estudiantiles y académicos
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
