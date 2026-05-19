import { useNavigate } from 'react-router';
import { ArrowLeft, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Logo from '@/components/common/Logo';
import wallpaperGreen from '@/assets/images/wallpaper_green.svg';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { fetchRecommendations } from '@/services/recommendations';

type NamedOption = {
  id: string;
  nombre: string;
};

type FormErrors = {
  dieta?: string;
  nivel?: string;
  presupuesto?: string;
  submit?: string;
};

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}

export default function FoodProfilePage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [dietas, setDietas] = useState<NamedOption[]>([]);
  const [niveles, setNiveles] = useState<NamedOption[]>([]);
  const [selectedDietaId, setSelectedDietaId] = useState<string>('');
  const [selectedNivelId, setSelectedNivelId] = useState<string>('');
  const [presupuesto, setPresupuesto] = useState('');

  const [alergenoQuery, setAlergenoQuery] = useState('');
  const [alergenoOptions, setAlergenoOptions] = useState<NamedOption[]>([]);
  const [selectedAlergenos, setSelectedAlergenos] = useState<NamedOption[]>([]);
  const [loadingAlergenos, setLoadingAlergenos] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const debouncedAlergenoQuery = useDebouncedValue(alergenoQuery, 300);
  const trimmedAlergenoQuery = useMemo(() => debouncedAlergenoQuery.trim(), [debouncedAlergenoQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadOptions = async () => {
      const [dietasResponse, nivelesResponse] = await Promise.all([
        supabase.from('dietas').select('id_dieta, tipo_dieta').order('tipo_dieta'),
        supabase.from('niveles_dificultad').select('id_dificultad, nivel').order('id_dificultad')
      ]);

      if (!isMounted) {
        return;
      }

      if (dietasResponse.error) {
        console.error('Failed to load dietas:', dietasResponse.error);
      } else {
        setDietas(
          (dietasResponse.data ?? []).map((item) => ({ id: item.id_dieta, nombre: item.tipo_dieta }))
        );
      }

      if (nivelesResponse.error) {
        console.error('Failed to load niveles:', nivelesResponse.error);
      } else {
        setNiveles(
          (nivelesResponse.data ?? []).map((item) => ({ id: item.id_dificultad, nombre: item.nivel }))
        );
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAlergenos = async () => {
      if (!trimmedAlergenoQuery) {
        setAlergenoOptions([]);
        return;
      }

      setLoadingAlergenos(true);
      const { data, error } = await supabase
        .from('alergeno')
        .select('id_alergeno, nombre')
        .ilike('nombre', `%${trimmedAlergenoQuery}%`)
        .order('nombre')
        .limit(10);

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error('Failed to load alergenos:', error);
        setAlergenoOptions([]);
      } else {
        const selectedIds = new Set(selectedAlergenos.map((item) => item.id));
        const options = (data ?? [])
          .map((item) => ({ id: item.id_alergeno, nombre: item.nombre }))
          .filter((item) => !selectedIds.has(item.id));
        setAlergenoOptions(options);
      }
      setLoadingAlergenos(false);
    };

    fetchAlergenos();

    return () => {
      isMounted = false;
    };
  }, [selectedAlergenos, trimmedAlergenoQuery]);

  const handleAddAlergeno = (option: NamedOption) => {
    setSelectedAlergenos((prev) => [...prev, option]);
    setAlergenoQuery('');
    setAlergenoOptions([]);
  };

  const handleRemoveAlergeno = (id: string) => {
    setSelectedAlergenos((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!selectedDietaId) {
      nextErrors.dieta = 'Selecciona una dieta.';
    }

    if (!selectedNivelId) {
      nextErrors.nivel = 'Selecciona un nivel de dificultad.';
    }

    if (!presupuesto || Number(presupuesto) <= 0) {
      nextErrors.presupuesto = 'Ingresa tu presupuesto semanal en COP.';
    }

    if (!user) {
      nextErrors.submit = 'Necesitas iniciar sesion para guardar el perfil.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const { error: usuarioError } = await supabase
      .from('usuario')
      .update({
        presupuesto_semanal: Number(presupuesto),
        nivel_dificultad: selectedNivelId,
      })
      .eq('id_usuario', user?.id ?? '');

    if (usuarioError) {
      setErrors({ submit: 'No se pudo guardar tu perfil. Intenta de nuevo.' });
      setIsSubmitting(false);
      return;
    }

    const { error: dietaDeleteError } = await supabase
      .from('usuario_dieta')
      .delete()
      .eq('id_usuario', user?.id ?? '');

    if (dietaDeleteError) {
      setErrors({ submit: 'No se pudo actualizar la dieta.' });
      setIsSubmitting(false);
      return;
    }

    const { error: dietaInsertError } = await supabase
      .from('usuario_dieta')
      .insert({
        id_usuario: user?.id,
        id_dieta: selectedDietaId,
      });

    if (dietaInsertError) {
      setErrors({ submit: 'No se pudo guardar la dieta seleccionada.' });
      setIsSubmitting(false);
      return;
    }

    const { error: alergenoDeleteError } = await supabase
      .from('usuario_alergeno')
      .delete()
      .eq('id_usuario', user?.id ?? '');

    if (alergenoDeleteError) {
      setErrors({ submit: 'No se pudieron actualizar los alergenos.' });
      setIsSubmitting(false);
      return;
    }

    if (selectedAlergenos.length > 0) {
      const alergenoRows = selectedAlergenos.map((alergeno) => ({
        id_usuario: user?.id,
        id_alergeno: alergeno.id,
      }));

      const { error: alergenoInsertError } = await supabase
        .from('usuario_alergeno')
        .insert(alergenoRows);

      if (alergenoInsertError) {
        setErrors({ submit: 'No se pudieron guardar los alergenos seleccionados.' });
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    setIsLoadingRecommendations(true);

    try {
      const result = await fetchRecommendations();
      console.log('Recommended recipe IDs:', result.recommended_recipe_ids);
    } catch (recommendationError) {
      console.error('Failed to fetch recommendations:', recommendationError);
    } finally {
      setIsLoadingRecommendations(false);
      navigate('/recommendations');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-[#E8E5DD] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${wallpaperGreen})` }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/10" />
      <div className="relative z-10 p-6 flex items-center gap-4">
        <button onClick={() => navigate('/register')} className="text-[color:var(--brand)] hover:bg-white/50 p-2 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="rounded-2xl bg-white border border-white/70 px-4 py-2 shadow-sm">
          <Logo size="sm" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <div className="inline-block rounded-[30px] bg-white border border-white/70 px-9 py-6 shadow-sm">
            <h1 className="text-3xl text-[#2C3E2F] mb-2" style={{ fontWeight: 700 }}>Perfil Alimenticio</h1>
            <p className="text-[#5A6B5C]">¡Bienvenido! Personalicemos tu experiencia</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 shadow-md space-y-6">
          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Alergias</label>
            <div className="relative">
              <input
                type="text"
                value={alergenoQuery}
                onChange={(event) => setAlergenoQuery(event.target.value)}
                placeholder="Busca alergenos..."
                className="w-full bg-[#F5F3ED] rounded-3xl p-4 text-[#2C3E2F] outline-none focus:ring-2 focus:ring-[color:var(--brand)]"
              />
              {(trimmedAlergenoQuery || loadingAlergenos) && (
                <div className="absolute z-10 mt-2 w-full rounded-2xl bg-white shadow-lg border border-[#E8E5DD] overflow-hidden">
                  {loadingAlergenos && (
                    <div className="px-4 py-3 text-sm text-[#5A6B5C]">Buscando...</div>
                  )}
                  {!loadingAlergenos && alergenoOptions.length === 0 && (
                    <div className="px-4 py-3 text-sm text-[#5A6B5C]">Sin resultados</div>
                  )}
                  {!loadingAlergenos && alergenoOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleAddAlergeno(option)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F5F3ED] transition-colors"
                    >
                      {option.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedAlergenos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedAlergenos.map((alergeno) => (
                  <span
                    key={alergeno.id}
                    className="inline-flex items-center gap-2 bg-[#F5F3ED] text-[#2C3E2F] px-3 py-1 rounded-full text-sm"
                  >
                    {alergeno.nombre}
                    <button
                      type="button"
                      onClick={() => handleRemoveAlergeno(alergeno.id)}
                      className="text-[#5A6B5C] hover:text-[#2C3E2F]"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Tipo de dieta</label>
            <div className="grid gap-3 sm:grid-cols-3">
              {dietas.map((dieta) => (
                <button
                  key={dieta.id}
                  type="button"
                  onClick={() => setSelectedDietaId(dieta.id)}
                  className={`px-4 py-3 rounded-2xl border transition-all ${
                    selectedDietaId === dieta.id
                      ? 'bg-[color:var(--brand)] text-white border-[color:var(--brand)] shadow-md'
                      : 'bg-[#F5F3ED] text-[#5A6B5C] border-transparent hover:bg-[#E8E5DD]'
                  }`}
                >
                  {dieta.nombre}
                </button>
              ))}
            </div>
            {errors.dieta && <p className="text-sm text-red-600 mt-2">{errors.dieta}</p>}
          </div>

          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Destreza Culinaria</label>
            <div className="bg-[#F5F3ED] rounded-3xl p-3 focus-within:ring-2 focus-within:ring-[color:var(--brand)]">
              <select
                value={selectedNivelId}
                onChange={(event) => setSelectedNivelId(event.target.value)}
                className="w-full bg-transparent outline-none text-[#2C3E2F]"
              >
                <option value="">Selecciona un nivel</option>
                {niveles.map((nivel) => (
                  <option key={nivel.id} value={nivel.id}>
                    {nivel.nombre}
                  </option>
                ))}
              </select>
            </div>
            {errors.nivel && <p className="text-sm text-red-600 mt-2">{errors.nivel}</p>}
          </div>

          <div>
            <label className="text-[#2C3E2F] mb-3 block text-lg" style={{ fontWeight: 600 }}>Presupuesto semanal (COP)</label>
            <div className="bg-[#F5F3ED] rounded-full p-4 focus-within:ring-2 focus-within:ring-[color:var(--brand)]">
              <input
                type="number"
                min={0}
                step={1000}
                placeholder="Ej: 150000"
                value={presupuesto}
                onChange={(event) => setPresupuesto(event.target.value)}
                className="w-full bg-transparent outline-none text-[#2C3E2F]"
              />
            </div>
            {errors.presupuesto && <p className="text-sm text-red-600 mt-2">{errors.presupuesto}</p>}
          </div>

          {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[color:var(--brand)] text-white py-4 rounded-full shadow-md hover:bg-[color:var(--brand-dark)] transition-colors mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F3ED] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontWeight: 600 }}
          >
            {isSubmitting ? 'Guardando...' : 'Continuar'}
          </button>
        </form>
      </div>
      {isLoadingRecommendations ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="size-12 rounded-full border-4 border-[color:var(--brand)] border-t-transparent animate-spin" />
          <p className="mt-4 text-[#2C3E2F]" style={{ fontWeight: 600 }}>
            Generando recomendaciones personalizadas...
          </p>
        </div>
      ) : null}
    </div>
  );
}
