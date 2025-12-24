// src/apis/pokemon.js
const API_BASE = "https://pokeapi.co/api/v2";

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function normalizeName(v) {
  return String(v || "").trim().toLowerCase();
}

async function getJSON(url, options = {}) {
  const timeoutMs = options.timeoutMs ?? 15000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const msg = text ? `${res.status} ${res.statusText} - ${text}` : `${res.status} ${res.statusText}`;
      const err = new Error(msg);
      err.status = res.status;
      err.url = url;
      throw err;
    }

    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function getPokemonList(params = {}) {
  const limit = Number.isFinite(Number(params.limit)) ? Number(params.limit) : 20;
  const offset = Number.isFinite(Number(params.offset)) ? Number(params.offset) : 0;

  const url = `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`;
  return await getJSON(url);
}

export async function getPokemonDetail(nameOrId) {
  const key = normalizeName(nameOrId);
  if (!isNonEmptyString(key)) {
    const err = new Error("缺少寶可夢名稱或編號");
    err.status = 400;
    throw err;
  }

  const url = `${API_BASE}/pokemon/${encodeURIComponent(key)}`;
  return await getJSON(url);
}

export async function getTypeList() {
  const url = `${API_BASE}/type`;
  return await getJSON(url);
}

export async function getGenerationList() {
  const url = `${API_BASE}/generation`;
  return await getJSON(url);
}

export async function getPokemonNamesByType(typeName) {
  const t = normalizeName(typeName);
  if (!isNonEmptyString(t)) return [];

  const url = `${API_BASE}/type/${encodeURIComponent(t)}`;
  const data = await getJSON(url);

  const arr = Array.isArray(data?.pokemon) ? data.pokemon : [];
  return arr
    .map((x) => normalizeName(x?.pokemon?.name))
    .filter((n) => isNonEmptyString(n));
}

export async function getPokemonNamesByGeneration(genIdOrName) {
  const g = normalizeName(genIdOrName);
  if (!isNonEmptyString(g)) return [];

  const url = `${API_BASE}/generation/${encodeURIComponent(g)}`;
  const data = await getJSON(url);

  const arr = Array.isArray(data?.pokemon_species) ? data.pokemon_species : [];
  return arr
    .map((x) => normalizeName(x?.name))
    .filter((n) => isNonEmptyString(n));
}
