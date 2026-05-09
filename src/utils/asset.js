const B = import.meta.env.BASE_URL
export const a = p => `${B}${p.replace(/^\//, '')}`
