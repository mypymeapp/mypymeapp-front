'use client';

import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

const teamMembers = [
  {
    name: 'Dante Basilici',
    role: 'Project Lead & Frontend Architect',
    description: 'Apasionado por crear experiencias de usuario intuitivas y robustas, liderando la visión técnica del frontend.',
    image: '/dante.jpeg',
    github: 'https://github.com/DanteBasilici',
    linkedin: 'https://www.linkedin.com/in/dante-ezequiel-b-006a65203/',
  },
  {
    name: 'Ruslan Komarytskiy',
    role: 'Fullstack Developer',
    description: 'Experto en conectar el frontend con el backend, asegurando un flujo de datos eficiente y seguro.',
    image: '/ruslan.jpeg',
    github: 'https://github.com/websportfolio',
    linkedin: 'https://www.linkedin.com/in/ruslan-komarytskiy-1665011ba',
  },
  {
    name: 'Federico Curto',
    role: 'Fullstack Developer',
    description: 'Especialista en la construcción de interfaces dinámicas y en la implementación de lógicas de negocio complejas.',
    image: '/fede.jpeg',
    github: 'https://github.com/FedeHuapi',
    linkedin: 'https://www.linkedin.com/in/federico-curto-318227288?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Esteban Rodriguez',
    role: 'UI/UX & Frontend Developer',
    description: 'Dedicado a traducir diseños en componentes funcionales y estéticamente agradables para el usuario.',
    image: '/esteban.jpeg',
    github: 'https://github.com/essamd3v',
    linkedin: 'https://www.linkedin.com/in/esteban-rodríguez-b26062372/',
  },
  {
    name: 'Pedro Manuel Martinez Olivero',
    role: 'Fullstack Developer',
    description: 'Enfocado en la optimización y el rendimiento, garantizando que la aplicación sea rápida y escalable.',
    image: '/pedro.jpeg',
    github: 'https://github.com/PMartinezOlivero',
    linkedin: 'https://www.linkedin.com/in/pmo-martinez/',
  },
  {
    name: 'Alvaro Paggi',
    role: 'Backend Lead',
    description: 'Arquitecto de la lógica del servidor, responsable de la base de datos, la seguridad y la API.',
    image: '/alvaro.jpeg',
    github: 'https://github.com/APaggiHitta',
    linkedin: 'https://www.linkedin.com/in/alvaro-paggi-903769380/',
  },
  {
    name: 'Guillermo Rivero',
    role: 'Backend Developer & DevOps',
    description: 'Especialista en la infraestructura del servidor, despliegues y la integración de servicios externos.',
    image: '/guille.jpeg',
    github: 'https://github.com/gilerme1',
    linkedin: 'https://www.linkedin.com/in/guillermorivero01',
  },
];

export default function NosotrosPage() {
  return (
    <div className="bg-background">
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground">
            Conoce al Equipo
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Somos un equipo de desarrolladores apasionados por la tecnología, dedicados a crear soluciones innovadoras que potencien a las pequeñas y medianas empresas.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {teamMembers.map((member) => (
            <div 
              key={member.name}
              className="bg-card border border-border rounded-2xl p-6 text-center flex flex-col items-center group relative overflow-hidden animate-neon-pulse"
            >
              <div className="relative mb-4">
                <Image
                  src={member.image}
                  alt={`Foto de ${member.name}`}
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-primary/50 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-xl font-bold text-foreground">{member.name}</h2>
              <p className="text-sm font-semibold text-primary mt-1">{member.role}</p>
              <p className="text-foreground/60 mt-4 text-sm flex-grow">{member.description}</p>
              <div className="flex gap-6 mt-6 pt-4 border-t border-border w-full justify-center">
                <Link href={member.github} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                  <FaGithub className="w-7 h-7" />
                </Link>
                <Link href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors">
                  <FaLinkedin className="w-7 h-7" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}