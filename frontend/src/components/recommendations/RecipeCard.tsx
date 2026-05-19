import { Clock } from 'lucide-react';

export type RecipeCardProps = {
  id_receta: number;
  nombre: string;
  descripcion?: string | null;
  duracion?: number | null;
  icon_name: string;
  onClick?: () => void;
};

export default function RecipeCard({
  nombre,
  descripcion,
  duracion,
  icon_name,
  onClick,
}: RecipeCardProps) {
  return (
    <div
      className="group bg-white rounded-[28px] p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out cursor-pointer"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="w-full aspect-square bg-gradient-to-br from-[color:var(--brand-soft)] to-[#F5F3ED] rounded-[24px] flex items-center justify-center text-7xl mb-4 transition-transform duration-500 group-hover:scale-105">
        <span className="text-[color:var(--brand)] text-5xl" aria-hidden="true">{icon_name?.[0]?.toUpperCase() || 'R'}</span>
      </div>
      <h3 className="text-[#2C3E2F] mb-3 text-xl" style={{ fontWeight: 600 }}>
        {nombre}
      </h3>
      {descripcion ? (
        <p className="text-[#5A6B5C] text-sm mb-4 line-clamp-2">{descripcion}</p>
      ) : null}
      <div className="flex items-center justify-between text-[#5A6B5C] mb-4">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{duracion ? `${duracion} min` : 'Sin tiempo'}</span>
        </div>
      </div>
      <button className="w-full bg-[color:var(--brand)] text-white py-3 rounded-full hover:bg-[color:var(--brand-dark)] transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-white">
        Anadir al menu
      </button>
    </div>
  );
}
