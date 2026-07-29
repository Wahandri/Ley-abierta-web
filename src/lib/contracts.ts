export interface Contract {
    id: number;
    source: string;
    external_id: string;
    organismo: string;
    entidad_contratante: string;
    titulo: string;
    descripcion: string;
    importe: number | null;
    moneda: string;
    empresa_ganadora: string;
    procedimiento: string;
    fecha_publicacion: string | null;
    fecha_adjudicacion: string | null;
    url_fuente: string;
    raw_json: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface ContractAnalysis {
    id: number;
    contract_id: number;
    summary_plain_es: string;
    anomalies: string[];
    keywords: string[];
    confidence: number;
    created_at: string;
}

export interface ContractDocument {
    id: number;
    contract_id: number;
    filename: string;
    local_path: string;
    extracted_text: string;
    checksum: string;
    created_at: string;
}

export interface ContractDetail {
    contract: Contract;
    analysis: ContractAnalysis | null;
    documents: ContractDocument[];
}

export interface ContractStats {
    total: number;
    total_importe: number;
    organismos: number;
    empresas: number;
    oldest: string | null;
    newest: string | null;
}

export async function getContracts(page = 1, pageSize = 20): Promise<{ contracts: Contract[]; page: number; pageSize: number }> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`/api/contracts?page=${page}&page_size=${pageSize}`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`API responded with ${res.status}`);
        return res.json();
    } catch {
        return { contracts: [], page, pageSize };
    }
}

export async function getContractById(id: number): Promise<ContractDetail | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`/api/contracts/${id}`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeout);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function searchContracts(q: string, limit = 50): Promise<{ query: string; results: Contract[]; total: number }> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`/api/contracts/search?q=${encodeURIComponent(q)}&limit=${limit}`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeout);
        if (!res.ok) return { query: q, results: [], total: 0 };
        return res.json();
    } catch {
        return { query: q, results: [], total: 0 };
    }
}

export async function getContractStats(): Promise<ContractStats | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`/api/contracts/stats`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeout);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function getContractsByCompany(name: string, limit = 50): Promise<{ company: string; contracts: Contract[]; total: number }> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`/api/contracts/company/${encodeURIComponent(name)}?limit=${limit}`, {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeout);
        if (!res.ok) return { company: name, contracts: [], total: 0 };
        return res.json();
    } catch {
        return { company: name, contracts: [], total: 0 };
    }
}

export function formatImporte(importe: number | null): string {
    if (importe === null) return 'No disponible';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(importe);
}

export function formatDate(date: string | null): string {
    if (!date) return '';
    try {
        return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
        return date;
    }
}

export interface MonthlyData {
    mes: string;
    contratos: number;
    importe: number;
}

export interface OrganismoData {
    organismo: string;
    contratos: number;
    importe: number;
    transparencia: number;
}

export interface ImporteRangeData {
    rango: string;
    contratos: number;
    importe: number;
}

export interface ProcedimientoData {
    procedimiento: string;
    contratos: number;
    importe: number;
}

export interface EstadoData {
    estado: string;
    contratos: number;
    importe: number;
}

export interface TransparencyData {
    media: number;
    min: number;
    max: number;
}

export interface DetalleStats {
    resumen: ContractStats;
    por_mes: MonthlyData[];
    por_organismo: OrganismoData[];
    por_importe: ImporteRangeData[];
    por_procedimiento: ProcedimientoData[];
    por_estado: EstadoData[];
    transparencia: TransparencyData;
    anomalias: { total: number };
}

export async function getDetailedStats(): Promise<DetalleStats | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch('/api/contracts/stats/detailed', {
            signal: controller.signal,
            cache: 'no-store'
        });
        clearTimeout(timeout);
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export function formatMillones(importe: number | null): string {
    if (importe === null || importe === undefined) return '—';
    const millones = importe / 1_000_000;
    if (millones >= 1000) {
        return `${(millones / 1000).toFixed(1)}B €`;
    }
    return `${millones.toFixed(0)}M €`;
}

export function formatNumero(n: number | null): string {
    if (n === null || n === undefined) return '—';
    return n.toLocaleString('es-ES');
}

const ESTADO_LABELS: Record<string, string> = {
    PUB: 'Publicado',
    RES: 'Resuelto',
    EV: 'Evaluación',
    ADJ: 'Adjudicado',
    PRE: 'Previo',
    ANUL: 'Anulado',
};

export function labelEstado(codigo: string): string {
    return ESTADO_LABELS[codigo] || codigo;
}
