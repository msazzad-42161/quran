import Realm, { BSON, ObjectSchema } from "realm";

export class Bookmark extends Realm.Object<Bookmark> {
    _id!: BSON.UUID;
    pageNumber!: number;
    details!: string;
    createdAt!: Date;

    static schema: ObjectSchema = {
        name: "Bookmark",
        primaryKey: "_id",
        properties: {
            _id: 'uuid',
            pageNumber: "int",
            details: "string",
            createdAt: {
                type: "date",
                default: new Date(),
            },
        },
    };

    constructor(realm: Realm, pageNumber: number, details: string) {
        super(realm, {
            _id: new BSON.UUID(),
            pageNumber,
            details,
        });
    }
}