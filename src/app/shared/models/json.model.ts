export class JsonKeyModel {
    constructor(
        public actin_filament: string = '',
        public centrosome: string = '',
        public cytosol: string = '',
        public endoplasmic_reticulum: string = '',
        public endosome: string = '',
        public focal_adhesion_site: string = '',
        public golgi_apparatus: string = '',
        public intermediate_filament: string = '',
        public lipid_droplet: string = '',
        public lysosome: string = '',
        public microtubule: string = '',
        public microtubule_end: string = '',
        public microtubule_organizing_center: string = '',
        public mitochondrion: string = '',
        public nuclear_body: string = '',
        public nuclear_membrane: string = '',
        public nuclear_speckle: string = '',
        public nucleoli_fibrillar_center: string = '',
        public nucleolus: string = '',
        public nucleoplasm: string = '',
        public peroxisome: string = '',
        public plasma_membrane: string = '',
        public rods_and_ring: string = '',
        public secreted_protein: string = ''
    ) {}
}

export class JsonValueModel {
    constructor(
        public Title: string = '',
        public ID: string = '',
        public min_pval: number = null,
        public log_min_pval: number = null,
        public interpolate: number = null,
    ) {}
}