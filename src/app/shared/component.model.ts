export class CellModel {
    constructor(
        public Title: string = '',
        public ID: string = '',
        public min_pval: number = null,
        public log_min_pval: number = null,
        public interpolate: number = null,
    ) {}
}