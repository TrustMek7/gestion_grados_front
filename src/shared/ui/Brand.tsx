import { brand } from '../config/brand'

export function Brand() {
  return (
    <div>
      <p className="text-3xl leading-none font-bold tracking-wider">{brand.acronym}</p>
      <p className="mt-2 max-w-44 text-xs leading-5 text-white/85">{brand.university}</p>
      <div className="mt-5 border-t border-white/15 pt-4 text-sm font-medium">Grados y Títulos</div>
    </div>
  )
}
