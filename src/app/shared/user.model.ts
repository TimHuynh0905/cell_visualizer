export class UserModel {
    constructor(
        public id: string,
        public displayName: string,
        public email: string,
        public createdAt: Date,
    ) {}
}