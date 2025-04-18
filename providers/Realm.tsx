import { RealmProvider } from "@realm/react";
import { PropsWithChildren } from "react";
import { Bookmark } from "../models/Bookmark";

export default function RealmCustomProvider({ children }: PropsWithChildren) {
    return (
        <RealmProvider schema={[Bookmark]}>
            {children}
        </RealmProvider>
    )
}