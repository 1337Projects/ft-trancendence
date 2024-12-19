import React from "react";
import SchemaFour from '../assets/schema/Schema4'

export default function Schema({data}) {

    if (!data || !data.rounds) {
        return ("loading ....")
    }
    
    return (
        <div className="p-2">
            <div className="w-fit mx-auto h-auto mt-16">
                <SchemaFour rounds={data.rounds} />
            </div>
        </div>
    )
}